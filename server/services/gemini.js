const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash'
];

async function callGemini(prompt, jsonMode = true, maxRetries = 1) {
  for (const model of MODELS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 50000); // 50s timeout

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const body = {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        };
        if (jsonMode) body.generationConfig.responseMimeType = 'application/json';

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        
        clearTimeout(timeout);

        if (response.status === 429) {
          const errorData = await response.json().catch(() => ({}));
          const retryDelay = parseRetryDelay(errorData);
          if (attempt < maxRetries && retryDelay <= 30) {
            const delay = retryDelay * 1000 || (Math.pow(2, attempt + 1) * 1000);
            console.log(`⏳ [${model}] Rate limited. Retrying in ${Math.round(delay / 1000)}s...`);
            await sleep(delay);
            continue;
          }
          console.log(`⚠️ [${model}] Quota exhausted. Trying next model...`);
          break;
        }
        if (response.status === 404) { console.log(`⚠️ [${model}] Not found. Next...`); break; }
        if (!response.ok) {
          const errText = await response.text().catch(() => 'Unknown');
          throw new Error(`[${model}] API Error ${response.status}: ${errText.substring(0, 200)}`);
        }

        const data = await response.json();
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error(`[${model}] Empty response`);

        // Strip markdown fences if present
        if (jsonMode) {
          text = text.replace(/^```json/mi, '').replace(/```$/m, '').trim();
        }

        console.log(`✅ [${model}] API call successful.`);
        return text;
      } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') {
          console.log(`⚠️ [${model}] Request timed out after 50s.`);
          if (attempt < maxRetries) continue;
          break; // Try next model on timeout
        }
        if (error.message?.includes('429') || error.message?.includes('quota')) {
          if (attempt < maxRetries) { await sleep(Math.pow(2, attempt + 1) * 1000); continue; }
          break;
        }
        throw error;
      }
    }
  }
  throw new Error('All Gemini models failed or rate-limited. Please wait and try again.');
}

function parseRetryDelay(errorData) {
  try {
    const details = errorData?.error?.details || [];
    for (const d of details) { if (d?.retryDelay) return parseInt(d.retryDelay) || 10; }
  } catch {}
  return 10;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ── Roadmap ──
async function generateRoadmap(studentProfile) {
  const { TOPIC_RESOURCES, PRODUCT_CURRICULUM, SERVICE_CURRICULUM, STARTUP_CURRICULUM } = require('../config/topicResources');

  const { name, college, branch, semester, cgpa, skills, targetCompanies, targetCompanyType, timeline } = studentProfile;
  
  // 1. Parse timeline → target weeks
  let targetWeeks = 12;
  const t = (timeline || '').toLowerCase();
  if (t.includes('6 month')) targetWeeks = 24;
  if (t.includes('1 year')) targetWeeks = 48;
  if (t.includes('3 month')) targetWeeks = 12;

  // 2. Detect company type → select curriculum template
  const types = (targetCompanyType || []).map(c => c.toLowerCase());
  let curriculum;
  if (types.some(c => c.includes('product'))) {
    curriculum = PRODUCT_CURRICULUM;
  } else if (types.some(c => c.includes('startup'))) {
    curriculum = STARTUP_CURRICULUM;
  } else if (types.some(c => c.includes('service'))) {
    curriculum = SERVICE_CURRICULUM;
  } else {
    // Default: product-focused (strongest preparation)
    curriculum = PRODUCT_CURRICULUM;
  }

  // 3. Skill gap analysis — identify topics the student already knows
  const studentSkillsNorm = (skills || []).map(s => s.toLowerCase().trim());
  
  function isTopicMastered(topicKey) {
    const topicData = TOPIC_RESOURCES[topicKey];
    if (!topicData) return false;
    const topicSkills = (topicData.skills || []).map(s => s.toLowerCase().trim());
    // Student has mastered this topic if they know ≥ 60% of its skills
    const matched = topicSkills.filter(ts =>
      studentSkillsNorm.some(ss => ss === ts || ss.includes(ts) || ts.includes(ss))
    );
    return topicSkills.length > 0 && (matched.length / topicSkills.length) >= 0.6;
  }

  // 4. Build the roadmap from curriculum, prioritizing gaps
  // First pass: separate into gap topics and mastered topics
  const gapTopics = [];
  const masteredTopics = [];
  const seen = new Set();

  for (const topicKey of curriculum.slice(0, targetWeeks)) {
    const topicData = TOPIC_RESOURCES[topicKey];
    if (!topicData) continue;
    
    if (isTopicMastered(topicKey)) {
      if (!seen.has(topicKey + '_m')) {
        masteredTopics.push(topicKey);
        seen.add(topicKey + '_m');
      }
    } else {
      gapTopics.push(topicKey); // Allow duplicates for deeper study
    }
  }

  // Build final week sequence: gaps first, then mastered topics for revision
  let weekSequence = [...gapTopics];
  let mi = 0;
  while (weekSequence.length < targetWeeks) {
    if (mi < masteredTopics.length) {
      weekSequence.push(masteredTopics[mi++]);
    } else if (gapTopics.length > 0) {
      // Cycle through gap topics for more practice
      weekSequence.push(gapTopics[weekSequence.length % gapTopics.length]);
    } else {
      weekSequence.push(curriculum[weekSequence.length % curriculum.length]);
    }
  }
  weekSequence = weekSequence.slice(0, targetWeeks);

  // 5. Build weeks with curated resources from config
  const topicAppearCount = {};
  const weeks = weekSequence.map((topicKey, i) => {
    const topicData = TOPIC_RESOURCES[topicKey] || TOPIC_RESOURCES['arrays'];
    topicAppearCount[topicKey] = (topicAppearCount[topicKey] || 0) + 1;
    const count = topicAppearCount[topicKey];

    let topicLabel = topicData.topic;
    if (count === 2) topicLabel += ' — Advanced Practice';
    if (count === 3) topicLabel += ' — Mock & Revision';
    if (count >= 4) topicLabel += ` — Deep Dive ${count}`;

    // Calculate hours based on timeline compression
    const baseHours = targetWeeks <= 12 ? 15 : targetWeeks <= 24 ? 10 : 8;

    return {
      weekNumber: i + 1,
      topic: topicLabel,
      skills: topicData.skills || [],
      resources: topicData.resources.map(r => ({
        title: r.title,
        url: r.url,
        type: r.type,
      })),
      estimatedHours: baseHours,
      completed: false,
    };
  });

  // 6. Compute skill gaps
  const allCurriculumSkills = new Set();
  weekSequence.forEach(tk => {
    const td = TOPIC_RESOURCES[tk];
    if (td) td.skills.forEach(s => allCurriculumSkills.add(s));
  });
  const skillGaps = [...allCurriculumSkills].filter(s =>
    !studentSkillsNorm.some(ss => ss === s.toLowerCase() || ss.includes(s.toLowerCase()) || s.toLowerCase().includes(ss))
  );

  // 7. Use AI ONLY for personalized scoring & encouragement (tiny prompt, fast)
  let aiAnalysis = null;
  try {
    const scoringPrompt = `You are Placivio, an expert placement coach. Give a brief analysis for this student.

Student: ${name} | ${branch} | CGPA ${cgpa} | Semester ${semester}
Skills: ${(skills || []).join(', ')}
Target Companies: ${(targetCompanies || []).join(', ')} (${(targetCompanyType || []).join(', ')})
Timeline: ${timeline}
Identified Skill Gaps: ${skillGaps.slice(0, 8).join(', ')}
Roadmap: ${targetWeeks} weeks planned

Return JSON ONLY:
{"placementScore":number 0-100,"scoreReason":"1 sentence","immediateActions":["action1","action2","action3"],"encouragement":"1 motivational sentence"}`;

    const text = await callGemini(scoringPrompt, true);
    aiAnalysis = JSON.parse(text);
  } catch (err) {
    console.log('AI scoring fallback:', err.message);
  }

  // 8. Return the complete roadmap
  const placementScore = aiAnalysis?.placementScore || Math.min(95, Math.round(30 + (cgpa || 5) * 4 + (skills?.length || 0) * 2));
  
  return {
    placementScore,
    scoreReason: aiAnalysis?.scoreReason || `Based on your ${branch} background, CGPA ${cgpa}, and ${(skills || []).length} skills.`,
    skillGaps: skillGaps.slice(0, 10),
    roadmap: weeks.map(w => ({ week: w.weekNumber, topic: w.topic, skills: w.skills, resources: w.resources, estimatedHours: w.estimatedHours })),
    immediateActions: aiAnalysis?.immediateActions || [
      `Start with Week 1: ${weeks[0]?.topic || 'Arrays'}`,
      'Set up a LeetCode account and solve 2 problems daily',
      'Create a study schedule and stick to it',
    ],
    encouragement: aiAnalysis?.encouragement || `You have ${timeline} to prepare — that's plenty of time with a solid plan. Let's go! 🚀`,
  };
}

// ── Feedback ──
async function generateFeedback(student, progressEntry, roadmap) {
  const prompt = `You are Placivio, placement coach. Student ${student.name} (${student.branch}, CGPA ${student.cgpa}) completed Week ${progressEntry.weekNumber}.

Skills Practiced: ${progressEntry.skillsLearned.join(', ')}
Hours: ${progressEntry.hoursSpent} | Rating: ${progressEntry.selfRating}/5
Blockers: ${progressEntry.blockers || 'None'}
Progress: ${roadmap.weeks.filter(w => w.completed).length}/${roadmap.totalWeeks} weeks
Previous Score: ${student.placementScore}

JSON format:
{"updatedScore":number,"feedback":"string","whatWentWell":"string","improvements":"string","nextWeekTip":"string","needsRoadmapAdjustment":boolean}`;

  try {
    const text = await callGemini(prompt, true);
    return JSON.parse(text);
  } catch {
    return { updatedScore: student.placementScore, feedback: 'Great job! Keep going.', whatWentWell: 'Consistency', improvements: 'More practice hours', nextWeekTip: 'Build a project', needsRoadmapAdjustment: false };
  }
}

// ── Chat with drive awareness ──
async function chatWithAgent(student, roadmap, progressHistory, message, drives = []) {
  const completedWeeks = roadmap ? roadmap.weeks.filter(w => w.completed).length : 0;
  const totalHours = progressHistory.reduce((sum, p) => sum + (p.hoursSpent || 0), 0);

  // Find current week (first incomplete week)
  const currentWeek = roadmap?.weeks?.find(w => !w.completed);
  const currentWeekInfo = currentWeek
    ? `Week ${currentWeek.weekNumber}: ${currentWeek.topic}`
    : 'All weeks completed';

  let driveContext = '';
  if (drives.length > 0) {
    driveContext = '\n\nUpcoming Campus Drives at their college:\n' + drives.slice(0, 5).map(d => {
      const daysLeft = Math.ceil((new Date(d.driveDate) - new Date()) / 86400000);
      const norm = (student.skills || []).map(s => s.toLowerCase().trim());
      const matched = (d.requiredSkills || []).filter(cs => norm.some(ss => ss === cs.toLowerCase().trim() || ss.includes(cs.toLowerCase().trim()) || cs.toLowerCase().trim().includes(ss)));
      const match = d.requiredSkills.length > 0 ? Math.round((matched.length / d.requiredSkills.length) * 100) : 100;
      return `- ${d.companyName} (${d.jobRole}, ${d.packageLPA} LPA) in ${daysLeft} days | Match: ${match}% | Needs: ${d.requiredSkills.join(', ')}`;
    }).join('\n');
  }

  const prompt = `You are an AI placement coach for ${student.name}, a ${student.branch} student at ${student.college} in Semester ${student.semester}.
Their target is ${(student.targetCompanyType || []).join(', ') || 'not specified'} companies (${(student.targetCompanies || []).join(', ') || 'not specified'}).
They have ${student.timeline || '6 months'} left for placements.
CGPA: ${student.cgpa}/10

Current skills: ${(student.skills || []).join(', ') || 'None listed'}
Weak areas / Skill gaps: ${roadmap?.skillGaps?.join(', ') || 'Not analyzed yet'}
Placement readiness score: ${student.placementScore}/100

Progress: ${completedWeeks}/${roadmap?.totalWeeks || 0} weeks completed | ${totalHours} total study hours
Currently on: ${currentWeekInfo}
${driveContext}

Student asks: "${message}"

RULES:
- NEVER give generic advice. ALWAYS reference their specific data above.
- Mention their current week topic, skill gaps, and target companies by name.
- If they ask about a drive/company, calculate and state their match percentage.
- Give specific, actionable next steps (e.g., "solve LC #200 Number of Islands" not "practice DSA").
- Be encouraging but honest about gaps.
- Keep responses concise (2-4 paragraphs max).`;

  try {
    return await callGemini(prompt, false);
  } catch (err) {
    console.error("❌ callGemini in chatWithAgent failed:", err.message || err);
    const errMsg = err.message || "";
    if (errMsg.includes("suspended") || errMsg.includes("suspended") || errMsg.includes("API key not valid") || errMsg.includes("403") || errMsg.includes("400")) {
      return "⚠️ **Connection Error**: The application's Gemini API Key has been suspended or is invalid (this usually happens if the key was exposed or pushed to GitHub). Please ask the administrator to update the `GEMINI_API_KEY` in the Vercel dashboard / local environment.";
    }
    return "I'm having trouble connecting to the AI. Try again in a moment!";
  }
}

// ── AI Shortlist for TPO ──
async function generateAIShortlist(drive, applicants) {
  const applicantList = applicants.map((a, i) => {
    const snap = a.studentSnapshot || {};
    return `${i + 1}. ${a.studentName || 'Student'} | Skills: ${(snap.skills || []).join(', ')} | CGPA: ${snap.cgpa || 'N/A'} | Branch: ${snap.branch || 'N/A'} | Match: ${a.matchPercentage}%`;
  }).join('\n');

  const prompt = `You are an AI recruiter assistant. A TPO wants to shortlist candidates for:

Company: ${drive.companyName}
Role: ${drive.jobRole}
Package: ${drive.packageLPA} LPA
Required Skills: ${drive.requiredSkills.join(', ')}
CGPA Cutoff: ${drive.cgpaCutoff}
Seats: ${drive.seatsAvailable}

Applicants:
${applicantList}

Shortlist the top ${Math.min(drive.seatsAvailable || 10, applicants.length)} candidates. Return JSON:
{"shortlisted":[{"index":number,"name":"string","reason":"string","score":number}],"summary":"string"}`;

  try {
    const text = await callGemini(prompt, true);
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse AI shortlist:', error);
    return { shortlisted: [], summary: "AI failed to generate a shortlist. Please review applications manually." };
  }
}

// ── Batch Report for TPO ──
async function generateBatchReport(students, drives) {
  const avgScore = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.placementScore || 0), 0) / students.length) : 0;
  const allSkills = {};
  students.forEach(s => (s.skills || []).forEach(sk => { allSkills[sk] = (allSkills[sk] || 0) + 1; }));
  const topSkills = Object.entries(allSkills).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => `${e[0]} (${e[1]})`);
  const ready = students.filter(s => (s.placementScore || 0) >= 70).length;

  const prompt = `Generate a placement batch report for a TPO:

Total Students: ${students.length}
Average Readiness Score: ${avgScore}/100
Students Ready (≥70%): ${ready}
Top Skills in Batch: ${topSkills.join(', ')}
Active Drives: ${drives.length}

Analyze and write a 3-paragraph report covering: batch readiness overview, top skills vs gaps, actionable recommendations. Return JSON:
{"report":"string","keyInsights":["array of 3-5 bullet points"],"riskStudents":number,"recommendedFocus":"string"}`;

  try {
    const text = await callGemini(prompt, true);
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse batch report:', error);
    return { report: "AI failed to generate report.", keyInsights: [], riskStudents: 0, recommendedFocus: "N/A" };
  }
}

module.exports = { generateRoadmap, generateFeedback, chatWithAgent, generateAIShortlist, generateBatchReport, callGemini };
