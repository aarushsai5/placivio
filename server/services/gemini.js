const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
];

async function callGemini(prompt, jsonMode = true, maxRetries = 3) {
  for (const model of MODELS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
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
        });

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
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error(`[${model}] Empty response`);

        console.log(`✅ [${model}] API call successful.`);
        return text;
      } catch (error) {
        if (error.message?.includes('429') || error.message?.includes('quota')) {
          if (attempt < maxRetries) { await sleep(Math.pow(2, attempt + 1) * 1000); continue; }
          break;
        }
        throw error;
      }
    }
  }
  throw new Error('All Gemini models rate-limited. Please wait and try again.');
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
  const { name, college, branch, semester, cgpa, skills, targetCompanies, timeline } = studentProfile;
  const prompt = `You are Placivio, an expert placement coach for Indian engineering students.

Student: ${name} | ${college} | ${branch} | Semester ${semester} | CGPA ${cgpa}
Current Skills: ${skills.join(', ')}
Target Companies: ${targetCompanies.join(', ')}
Timeline: ${timeline}

Analyze skills, identify gaps for target companies, create a week-by-week roadmap with 3 free resources each (YouTube/docs/free courses). Give a score 0-100 and 3 immediate actions.

JSON format:
{"placementScore":number,"scoreReason":"string","skillGaps":["array"],"roadmap":[{"week":number,"topic":"string","skills":["array"],"resources":[{"title":"string","url":"string","type":"string"}],"estimatedHours":number}],"immediateActions":["3 strings"],"encouragement":"string"}`;

  const text = await callGemini(prompt, true);
  return JSON.parse(text);
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

  let driveContext = '';
  if (drives.length > 0) {
    driveContext = '\n\nUpcoming Campus Drives at their college:\n' + drives.slice(0, 5).map(d => {
      const daysLeft = Math.ceil((new Date(d.driveDate) - new Date()) / 86400000);
      const norm = student.skills.map(s => s.toLowerCase().trim());
      const matched = (d.requiredSkills || []).filter(cs => norm.some(ss => ss.includes(cs.toLowerCase().trim()) || cs.toLowerCase().trim().includes(ss)));
      const match = d.requiredSkills.length > 0 ? Math.round((matched.length / d.requiredSkills.length) * 100) : 100;
      return `- ${d.companyName} (${d.jobRole}, ${d.packageLPA} LPA) in ${daysLeft} days | Match: ${match}% | Needs: ${d.requiredSkills.join(', ')}`;
    }).join('\n');
  }

  const prompt = `You are Placivio, a personal AI placement coach. You're chatting with ${student.name}.

Profile: ${student.college} | ${student.branch} | Sem ${student.semester} | CGPA ${student.cgpa}
Skills: ${student.skills.join(', ')}
Target Companies: ${student.targetCompanies.join(', ')}
Score: ${student.placementScore}/100 | Progress: ${completedWeeks}/${roadmap?.totalWeeks || 0} weeks | Hours: ${totalHours}
Skill Gaps: ${roadmap?.skillGaps?.join(', ') || 'Not analyzed'}
${driveContext}

Student asks: "${message}"

Be helpful, specific, encouraging. Reference their real data. If asking about drives/companies, give specific match % and what skills to learn. Be concise.`;

  try {
    return await callGemini(prompt, false);
  } catch {
    return "I'm having trouble connecting. Try again in a moment!";
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

  const text = await callGemini(prompt, true);
  return JSON.parse(text);
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

  const text = await callGemini(prompt, true);
  return JSON.parse(text);
}

module.exports = { generateRoadmap, generateFeedback, chatWithAgent, generateAIShortlist, generateBatchReport, callGemini };
