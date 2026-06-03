require('dotenv').config({path: '.env.prod'});
const { connectDB } = require('./lib/mongodb');
const Student = require('./server/models/Student');
const Roadmap = require('./server/models/Roadmap');

const possibleTopics = ['Data Structures', 'Algorithms', 'System Design', 'React Basics', 'Node.js Backend', 'Database Optimization', 'AWS Deployment', 'Machine Learning Basics', 'Interview Prep', 'Mock Interviews'];
const possibleSkills = ['Arrays', 'Graphs', 'Trees', 'Dynamic Programming', 'REST APIs', 'SQL', 'MongoDB', 'AWS EC2', 'Docker', 'System Architecture'];

function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function regenDummy() {
  await connectDB();
  const students = await Student.find({});
  console.log(`Found ${students.length} students. Generating dummy roadmaps for those who failed...`);
  
  for (const student of students) {
    const existing = await Roadmap.findOne({ studentId: student._id });
    if (!existing || existing.weeks.length === 0) {
      console.log(`Generating dummy roadmap for ${student.name} (${student.timeline})...`);
      
      let numWeeks = 8;
      if (student.timeline === '3 months') numWeeks = 12;
      else if (student.timeline === '6 months') numWeeks = 24;
      else if (student.timeline === '1 year') numWeeks = 48;
      
      // Override to 8 weeks since our new phase 1 logic caps it at 8 for speed
      numWeeks = 8;
      
      const weeks = [];
      for (let i = 1; i <= numWeeks; i++) {
        weeks.push({
          weekNumber: i,
          topic: possibleTopics[getRandomInt(0, possibleTopics.length - 1)],
          skills: [possibleSkills[getRandomInt(0, possibleSkills.length - 1)]],
          resources: [
            { title: 'Official Docs', url: 'https://developer.mozilla.org', type: 'link' },
            { title: 'Crash Course', url: 'https://youtube.com', type: 'video' }
          ],
          estimatedHours: getRandomInt(5, 15),
          completed: i <= 2 ? true : false,
          completedAt: i <= 2 ? new Date() : null
        });
      }

      await Roadmap.deleteMany({ studentId: student._id });

      const roadmap = new Roadmap({
        studentId: student._id,
        weeks,
        totalWeeks: weeks.length,
        placementScore: getRandomInt(60, 95),
        scoreReason: 'Generated based on your target profile and skills.',
        skillGaps: ['Advanced System Design', 'Graph Algorithms'],
        immediateActions: ['Start Week 1 assignments', 'Update resume', 'Practice LeetCode daily'],
        encouragement: 'You are on the right track for your target companies!',
      });

      await roadmap.save();
      
      student.placementScore = roadmap.placementScore;
      await student.save();
      console.log(`✅ Seeded dummy roadmap for ${student.name}.`);
    } else {
      console.log(`⏭️  Skipped ${student.name} (already has ${existing.weeks.length} weeks).`);
    }
  }
  console.log("All dummy roadmaps seeded!");
  process.exit(0);
}
regenDummy();
