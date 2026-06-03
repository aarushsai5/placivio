const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Tpo = require('../models/Tpo');
const Company = require('../models/Company');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Roadmap = require('../models/Roadmap');
const Progress = require('../models/Progress');
const seedCompanies = require('../seeds/companies');

const firstNames = ['Aarav', 'Diya', 'Kabir', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Priya', 'Rahul', 'Neha', 'Arjun', 'Kavya', 'Aditya', 'Ishita', 'Karan', 'Riya', 'Sameer', 'Shruti', 'Varun', 'Tanvi', 'Abhishek', 'Meera', 'Rishabh', 'Aarti', 'Yash'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Iyer', 'Verma', 'Reddy', 'Kumar', 'Das', 'Gupta', 'Jain', 'Mehta', 'Bose', 'Chaudhary', 'Nair', 'Menon', 'Rao', 'Yadav', 'Pandey', 'Desai', 'Kaur'];
const possibleSkills = ['React', 'Node.js', 'JavaScript', 'SQL', 'DSA', 'Git', 'Python', 'Java', 'Aptitude', 'Communication', 'C++', 'Embedded Systems', 'HTML/CSS', 'System Design', 'Docker', 'AWS', 'Machine Learning'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSkills() {
  const count = getRandomInt(3, 7);
  const shuffled = [...possibleSkills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// POST /api/seed - Seeds fresh simulation data
router.post('/', async (req, res) => {
  try {
    console.log('⚡ Starting database seed process...');
    
    // Clear existing data
    await Promise.all([
      Student.deleteMany({}),
      Tpo.deleteMany({}),
      Company.deleteMany({}),
      Drive.deleteMany({}),
      Application.deleteMany({}),
      Notification.deleteMany({}),
      Roadmap.deleteMany({}),
      Progress.deleteMany({})
    ]);
    console.log('🧹 Cleared all collections.');

    // Seed companies first
    await seedCompanies();
    console.log('🏢 Seeded companies list.');

    // Seed TPO accounts
    const tpo = new Tpo({
      name: 'Dr. Rajesh Kumar',
      email: 'tpo@vit.edu',
      password: 'password123',
      college: 'VIT Vellore',
      designation: 'Head of Placements'
    });
    await tpo.save();

    const adminTpo = new Tpo({
      name: 'Admin Placements',
      email: 'admin@vit.edu',
      password: 'password123',
      college: 'VIT Vellore',
      designation: 'Director of Placements'
    });
    await adminTpo.save();
    console.log('🎓 Seeded TPO and Admin accounts.');

    // Generate 25 Students
    const studentsData = [];
    for (let i = 0; i < 25; i++) {
      const fName = firstNames[i];
      const lName = lastNames[getRandomInt(0, lastNames.length - 1)];
      let cgpa = (getRandomInt(50, 98) / 10).toFixed(1);
      let branch = ['CSE', 'IT', 'ECE', 'ME'][getRandomInt(0, 3)];
      let placementScore = getRandomInt(40, 95);

      // Hardcode first 4 users based on user request
      if (i === 0) { branch = 'CSE'; cgpa = 9.2; placementScore = 88; } // Aarav: High Readiness
      if (i === 1) { branch = 'CSE'; cgpa = 7.5; placementScore = 65; } // Diya: Mid Readiness
      if (i === 2) { branch = 'ECE'; cgpa = 6.8; placementScore = 55; } // Kabir: Mid Readiness
      if (i === 3) { branch = 'IT'; cgpa = 5.5; placementScore = 30; }  // Ananya: Needs Attention

      let targetType = ['Service Based'];
      if (cgpa > 8) targetType = ['Product Based', 'Startup'];
      else if (cgpa > 7) targetType = ['Product Based', 'Service Based'];
      
      studentsData.push({
        name: `${fName} ${lName}`,
        email: `${fName.toLowerCase()}@student.edu`,
        password: 'password123',
        college: 'VIT Vellore',
        branch: branch,
        semester: '7th',
        cgpa: parseFloat(cgpa),
        skills: getRandomSkills(),
        targetCompanies: ['TCS', 'Infosys', 'Google', 'Microsoft'].sort(() => 0.5 - Math.random()).slice(0, 2),
        targetCompanyType: targetType,
        timeline: ['3 months', '6 months', '1 year'][getRandomInt(0, 2)],
        profileCompleted: true,
        placementScore: placementScore
      });
    }

    const seededStudents = [];
    for (const data of studentsData) {
      const s = new Student(data);
      await s.save();
      seededStudents.push(s);
    }
    console.log(`👨‍🎓 Seeded ${seededStudents.length} student accounts.`);

    // Seed roadmaps
    for (const student of seededStudents) {
      const r = new Roadmap({
        studentId: student._id,
        placementScore: student.placementScore,
        scoreReason: 'Based on current skills and CGPA context.',
        skillGaps: ['System Design', 'Advanced DSA'],
        immediateActions: ['Practice daily', 'Build projects'],
        encouragement: 'Keep going, you are doing great!',
        totalWeeks: 4,
        weeks: [
          {
            weekNumber: 1, topic: 'Data Structures', skills: ['Graphs'], estimatedHours: 10,
            completed: getRandomInt(0, 1) === 1, completedAt: new Date(), resources: []
          },
          {
            weekNumber: 2, topic: 'Algorithms', skills: ['Dynamic Programming'], estimatedHours: 12,
            completed: false, resources: []
          }
        ]
      });
      await r.save();
    }
    console.log('🗺️ Seeded roadmaps for all students.');

    // Seed mock drives hosted by the TPO
    const drivesData = [
      {
        companyName: 'Google',
        jobRole: 'Software Engineer Intern',
        packageLPA: 18,
        driveDate: new Date(Date.now() + 15 * 86400000),
        registrationDeadline: new Date(Date.now() + 5 * 86400000),
        requiredSkills: ['DSA', 'System Design', 'JavaScript', 'Python', 'C++'],
        cgpaCutoff: 8.5,
        branchesAllowed: ['CSE', 'IT', 'CSBS'],
        seatsAvailable: 5,
        driveType: 'oncampus',
        status: 'upcoming',
        postedBy: tpo._id,
        college: 'VIT Vellore'
      },
      {
        companyName: 'TCS',
        jobRole: 'Ninja & Digital Developer',
        packageLPA: 7,
        driveDate: new Date(Date.now() + 20 * 86400000),
        registrationDeadline: new Date(Date.now() + 10 * 86400000),
        requiredSkills: ['Java', 'SQL', 'Aptitude', 'Communication'],
        cgpaCutoff: 6.0,
        branchesAllowed: ['CSE', 'IT', 'CSBS', 'ECE', 'ME', 'CE'],
        seatsAvailable: 150,
        driveType: 'oncampus',
        status: 'upcoming',
        postedBy: tpo._id,
        college: 'VIT Vellore'
      },
      {
        companyName: 'Razorpay',
        jobRole: 'Associate Frontend Engineer',
        packageLPA: 12,
        driveDate: new Date(Date.now() - 3 * 86400000),
        registrationDeadline: new Date(Date.now() - 1 * 86400000),
        requiredSkills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
        cgpaCutoff: 7.0,
        branchesAllowed: ['CSE', 'IT', 'CSBS'],
        seatsAvailable: 10,
        driveType: 'oncampus',
        status: 'ongoing',
        postedBy: tpo._id,
        college: 'VIT Vellore'
      },
      {
        companyName: 'Amazon',
        jobRole: 'SDE 1',
        packageLPA: 24,
        driveDate: new Date(Date.now() + 30 * 86400000),
        registrationDeadline: new Date(Date.now() + 15 * 86400000),
        requiredSkills: ['DSA', 'Java', 'AWS', 'System Design'],
        cgpaCutoff: 8.0,
        branchesAllowed: ['CSE', 'IT', 'ECE'],
        seatsAvailable: 15,
        driveType: 'oncampus',
        status: 'upcoming',
        postedBy: tpo._id,
        college: 'VIT Vellore'
      },
      {
        companyName: 'Infosys',
        jobRole: 'Systems Engineer',
        packageLPA: 4.5,
        driveDate: new Date(Date.now() + 10 * 86400000),
        registrationDeadline: new Date(Date.now() + 2 * 86400000),
        requiredSkills: ['Python', 'SQL', 'Aptitude'],
        cgpaCutoff: 6.5,
        branchesAllowed: [], // Any branch
        seatsAvailable: 200,
        driveType: 'oncampus',
        status: 'upcoming',
        postedBy: tpo._id,
        college: 'VIT Vellore'
      },
      {
        companyName: 'Zomato',
        jobRole: 'Backend Developer',
        packageLPA: 15,
        driveDate: new Date(Date.now() + 5 * 86400000),
        registrationDeadline: new Date(Date.now() + 1 * 86400000),
        requiredSkills: ['Node.js', 'Python', 'AWS', 'System Design'],
        cgpaCutoff: 7.5,
        branchesAllowed: ['CSE', 'IT'],
        seatsAvailable: 8,
        driveType: 'offcampus',
        status: 'upcoming',
        postedBy: tpo._id,
        college: 'VIT Vellore'
      }
    ];

    const seededDrives = [];
    for (const dData of drivesData) {
      const d = new Drive(dData);
      await d.save();
      seededDrives.push(d);
    }
    console.log(`🏢 Seeded ${seededDrives.length} placement drives.`);

    // Assign a random number of applications to drives
    for (const d of seededDrives) {
      const numApplicants = getRandomInt(5, 20);
      const shuffledStudents = [...seededStudents].sort(() => 0.5 - Math.random()).slice(0, numApplicants);
      
      for (const s of shuffledStudents) {
        // Only apply if eligible for basic branch/cgpa cuts
        if (d.branchesAllowed.length > 0 && !d.branchesAllowed.includes(s.branch)) continue;
        if (s.cgpa < d.cgpaCutoff) continue;

        const matchPercent = getRandomInt(40, 100);
        const status = getRandomInt(0, 4) === 0 ? 'shortlisted' : 'applied'; // Randomly shortlist 20%

        const app = new Application({
          studentId: s._id,
          driveId: d._id,
          status,
          matchPercentage: matchPercent,
          studentSnapshot: {
            skills: s.skills,
            cgpa: s.cgpa,
            branch: s.branch,
            semester: s.semester
          }
        });
        await app.save();
        d.applicants.push(s._id);
        if (status === 'shortlisted') {
          d.shortlisted.push(s._id);
        }
      }
      await d.save();
    }
    console.log('📝 Seeded drive applications.');

    // Seed some notifications/alerts for Aarav
    await Notification.create([
      {
        userId: seededStudents[0]._id,
        userType: 'student',
        title: '🎯 Company Match!',
        message: "You're 80% ready for Google! Keep pushing.",
        type: 'alert'
      }
    ]);

    console.log('✅ Database seeding complete!');

    res.json({
      success: true,
      message: 'Database seeded with Indian demo data successfully! 🚀',
      credentials: {
        tpo: {
          email: 'tpo@vit.edu',
          password: 'password123',
          name: 'Dr. Rajesh Kumar',
          college: 'VIT Vellore'
        },
        admin: {
          email: 'admin@vit.edu',
          password: 'password123',
          name: 'Admin Placements',
          college: 'VIT Vellore'
        },
        students: seededStudents.map(s => ({
          email: s.email,
          password: 'password123',
          name: s.name,
          branch: s.branch,
          cgpa: s.cgpa
        }))
      }
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    res.status(500).json({ error: 'Database seeding failed.', details: error.message });
  }
});

module.exports = router;
