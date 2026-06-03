require('dotenv').config({path: '.env.prod'});
const { connectDB } = require('./lib/mongodb');
const Student = require('./server/models/Student');
const Roadmap = require('./server/models/Roadmap');
const { generateRoadmap } = require('./server/services/gemini');

async function regen() {
  await connectDB();
  const students = await Student.find({});
  console.log(`Found ${students.length} students. Regenerating roadmaps...`);
  
  for (const student of students) {
    try {
      console.log(`Generating for ${student.name} (${student.timeline})...`);
      const aiResponse = await generateRoadmap(student);
      
      const weeks = (aiResponse.roadmap || []).map((w, i) => ({
        weekNumber: w.week || i + 1,
        topic: w.topic,
        skills: w.skills || [],
        resources: (w.resources || []).map(r => ({
          title: r.title,
          url: r.url,
          type: r.type || 'link',
        })),
        estimatedHours: w.estimatedHours || 5,
        completed: false,
      }));

      await Roadmap.deleteMany({ studentId: student._id });

      const roadmap = new Roadmap({
        studentId: student._id,
        weeks,
        totalWeeks: weeks.length,
        placementScore: aiResponse.placementScore || 0,
        scoreReason: aiResponse.scoreReason || '',
        skillGaps: aiResponse.skillGaps || [],
        immediateActions: aiResponse.immediateActions || [],
        encouragement: aiResponse.encouragement || '',
      });

      await roadmap.save();
      
      student.placementScore = aiResponse.placementScore || 0;
      await student.save();
      
      console.log(`✅ Done for ${student.name}. Generated ${weeks.length} weeks. Waiting 5s...`);
      await new Promise(r => setTimeout(r, 5000));
    } catch(e) {
      console.log(`❌ Failed for ${student.name}:`, e.message);
    }
  }
  console.log("All done!");
  process.exit(0);
}
regen();
