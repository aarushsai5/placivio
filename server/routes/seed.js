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

    // Seed Students
    const studentsData = [
      {
        name: 'Aarav Sharma',
        email: 'aarav@student.edu',
        password: 'password123',
        college: 'VIT Vellore',
        branch: 'CSE',
        semester: '7th',
        cgpa: 9.2,
        skills: ['React', 'Node.js', 'JavaScript', 'SQL', 'DSA', 'Git'],
        targetCompanies: ['Google', 'Microsoft', 'Razorpay'],
        targetCompanyType: ['Product Based', 'Startup'],
        timeline: '6 months',
        profileCompleted: true,
        placementScore: 85
      },
      {
        name: 'Diya Patel',
        email: 'diya@student.edu',
        password: 'password123',
        college: 'VIT Vellore',
        branch: 'CSE',
        semester: '7th',
        cgpa: 8.5,
        skills: ['Python', 'Java', 'SQL', 'Aptitude', 'Communication'],
        targetCompanies: ['TCS', 'Infosys', 'Accenture'],
        targetCompanyType: ['Service Based'],
        timeline: '6 months',
        profileCompleted: true,
        placementScore: 60
      },
      {
        name: 'Kabir Singh',
        email: 'kabir@student.edu',
        password: 'password123',
        college: 'VIT Vellore',
        branch: 'ECE',
        semester: '7th',
        cgpa: 7.8,
        skills: ['C++', 'Embedded Systems', 'Aptitude', 'Communication', 'Python'],
        targetCompanies: ['Wipro', 'Deloitte'],
        targetCompanyType: ['Service Based'],
        timeline: '1 year',
        profileCompleted: true,
        placementScore: 50
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya@student.edu',
        password: 'password123',
        college: 'VIT Vellore',
        branch: 'IT',
        semester: '7th',
        cgpa: 6.8,
        skills: ['HTML/CSS', 'JavaScript', 'React', 'Communication'],
        targetCompanies: ['Zomato', 'Paytm'],
        targetCompanyType: ['Startup'],
        timeline: '3 months',
        profileCompleted: true,
        placementScore: 45
      }
    ];

    const seededStudents = [];
    for (const data of studentsData) {
      const s = new Student(data);
      await s.save();
      seededStudents.push(s);
    }
    console.log(`👨‍🎓 Seeded ${seededStudents.length} student accounts.`);

    // Seed mock roadmaps for the students
    // Aarav Sharma's roadmap
    const aaravRoadmap = new Roadmap({
      studentId: seededStudents[0]._id,
      placementScore: 85,
      scoreReason: 'Great fundamental coding skills, strong project experience in React/Node.js, and excellent academic record (CGPA 9.2). Needs focus on advanced System Design and high-scale system patterns.',
      skillGaps: ['System Design', 'Docker', 'AWS'],
      immediateActions: [
        'Read System Design Primer and understand horizontal scaling',
        'Deploy a project using Docker containers',
        'Learn basic AWS services (EC2, S3, RDS)'
      ],
      encouragement: 'You are in a prime position for product-based roles. Refine your advanced architectural skills to ace top-tier interviews!',
      totalWeeks: 4,
      weeks: [
        {
          weekNumber: 1,
          topic: 'Advanced Data Structures & Algorithms',
          skills: ['Graphs', 'Dynamic Programming', 'Tries'],
          estimatedHours: 15,
          completed: true,
          completedAt: new Date(Date.now() - 10 * 86400000),
          resources: [
            { title: 'LeetCode Graph Patterns', url: 'https://leetcode.com', type: 'practice' },
            { title: 'Dynamic Programming Playlist', url: 'https://youtube.com', type: 'video' }
          ]
        },
        {
          weekNumber: 2,
          topic: 'System Design Fundamentals',
          skills: ['Load Balancers', 'Caching', 'Database Sharding'],
          estimatedHours: 12,
          completed: false,
          resources: [
            { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'reading' }
          ]
        },
        {
          weekNumber: 3,
          topic: 'Containerization & DevOps Basics',
          skills: ['Docker', 'CI/CD Pipelines'],
          estimatedHours: 10,
          completed: false,
          resources: [
            { title: 'Docker for Beginners', url: 'https://docker.com', type: 'reading' }
          ]
        },
        {
          weekNumber: 4,
          topic: 'Cloud Infrastructure & Deployment',
          skills: ['AWS', 'Serverless Functions'],
          estimatedHours: 10,
          completed: false,
          resources: [
            { title: 'AWS Cloud Practitioner Guide', url: 'https://aws.amazon.com', type: 'reading' }
          ]
        }
      ]
    });
    await aaravRoadmap.save();

    // Diya Patel's roadmap
    const diyaRoadmap = new Roadmap({
      studentId: seededStudents[1]._id,
      placementScore: 60,
      scoreReason: 'Strong foundation in Python and SQL. Needs to master core Java concepts, object-oriented design, and practice aptitude tests for service-based MNC screenings.',
      skillGaps: ['Java', 'Aptitude Practice', 'Object-Oriented Design'],
      immediateActions: [
        'Complete Java Object-Oriented programming tutorials',
        'Solve 5 quantitative aptitude questions daily',
        'Build a small Java-based console application'
      ],
      encouragement: 'Your backend logic is solid. Focus on standard MNC placement patterns, and you will easily clear the first rounds!',
      totalWeeks: 4,
      weeks: [
        {
          weekNumber: 1,
          topic: 'Core Java & OOPs Concepts',
          skills: ['Inheritance', 'Polymorphism', 'Interfaces'],
          estimatedHours: 12,
          completed: true,
          completedAt: new Date(Date.now() - 5 * 86400000),
          resources: [
            { title: 'Java OOPs Explained', url: 'https://geeksforgeeks.org', type: 'reading' }
          ]
        },
        {
          weekNumber: 2,
          topic: 'Quantitative & Logical Aptitude',
          skills: ['Percentages', 'Time & Work', 'Puzzles'],
          estimatedHours: 15,
          completed: false,
          resources: [
            { title: 'IndiaBIX Aptitude Practice', url: 'https://indiabix.com', type: 'practice' }
          ]
        },
        {
          weekNumber: 3,
          topic: 'SQL Queries & Database Management',
          skills: ['Joins', 'Indexes', 'Subqueries'],
          estimatedHours: 8,
          completed: false,
          resources: [
            { title: 'SQL Zoo Interactive Tutorial', url: 'https://sqlzoo.net', type: 'practice' }
          ]
        },
        {
          weekNumber: 4,
          topic: 'Mock Interview & Resume Prep',
          skills: ['Resume Building', 'Behavioral Questions'],
          estimatedHours: 8,
          completed: false,
          resources: [
            { title: 'Resume Templates for Placements', url: 'https://novoresume.com', type: 'reading' }
          ]
        }
      ]
    });
    await diyaRoadmap.save();
    console.log('🗺️ Seeded roadmaps for key candidates.');

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
      }
    ];

    const seededDrives = [];
    for (const dData of drivesData) {
      const d = new Drive(dData);
      await d.save();
      seededDrives.push(d);
    }
    console.log('🏢 Seeded placement drives.');

    // Seed check-in progress
    const progress1 = new Progress({
      studentId: seededStudents[0]._id,
      weekNumber: 1,
      skillsLearned: ['Graphs', 'Dynamic Programming'],
      hoursSpent: 16,
      selfRating: 4,
      blockers: 'Had some trouble optimizing Dynamic Programming subproblems for knapsack variations.',
      agentFeedback: 'Awesome job, Aarav! For DP optimization, focus on the bottom-up iteration pattern to visualize space complexity. Keep practicing graph traversals!',
      date: new Date(Date.now() - 10 * 86400000)
    });
    await progress1.save();

    const progress2 = new Progress({
      studentId: seededStudents[1]._id,
      weekNumber: 1,
      skillsLearned: ['Core Java', 'OOPs Concepts'],
      hoursSpent: 10,
      selfRating: 4,
      blockers: 'Understanding interface abstraction was slightly challenging.',
      agentFeedback: 'Great start, Diya! Think of interfaces as a contract that defines what a class can do, not how it does it. You are on track for MNC requirements.',
      date: new Date(Date.now() - 5 * 86400000)
    });
    await progress2.save();
    console.log('📈 Seeded check-in histories.');

    // Seed Applications
    const app1 = new Application({
      studentId: seededStudents[0]._id,
      driveId: seededDrives[0]._id,
      status: 'applied',
      matchPercentage: 80,
      studentSnapshot: {
        skills: seededStudents[0].skills,
        cgpa: seededStudents[0].cgpa,
        branch: seededStudents[0].branch,
        semester: seededStudents[0].semester
      }
    });
    await app1.save();
    seededDrives[0].applicants.push(seededStudents[0]._id);

    const app2 = new Application({
      studentId: seededStudents[0]._id,
      driveId: seededDrives[2]._id,
      status: 'shortlisted',
      matchPercentage: 100,
      studentSnapshot: {
        skills: seededStudents[0].skills,
        cgpa: seededStudents[0].cgpa,
        branch: seededStudents[0].branch,
        semester: seededStudents[0].semester
      }
    });
    await app2.save();
    seededDrives[2].applicants.push(seededStudents[0]._id);
    seededDrives[2].shortlisted.push(seededStudents[0]._id);

    const app3 = new Application({
      studentId: seededStudents[1]._id,
      driveId: seededDrives[1]._id,
      status: 'applied',
      matchPercentage: 100,
      studentSnapshot: {
        skills: seededStudents[1].skills,
        cgpa: seededStudents[1].cgpa,
        branch: seededStudents[1].branch,
        semester: seededStudents[1].semester
      }
    });
    await app3.save();
    seededDrives[1].applicants.push(seededStudents[1]._id);

    const app4 = new Application({
      studentId: seededStudents[2]._id,
      driveId: seededDrives[1]._id,
      status: 'applied',
      matchPercentage: 75,
      studentSnapshot: {
        skills: seededStudents[2].skills,
        cgpa: seededStudents[2].cgpa,
        branch: seededStudents[2].branch,
        semester: seededStudents[2].semester
      }
    });
    await app4.save();
    seededDrives[1].applicants.push(seededStudents[2]._id);

    // Save drives with applicants array
    await Promise.all(seededDrives.map(d => d.save()));
    console.log('📝 Seeded drive applications.');

    // Seed some notifications/alerts
    await Notification.create([
      {
        userId: seededStudents[0]._id,
        userType: 'student',
        title: '🎯 Company Match!',
        message: "You're 80% ready for Google! Keep pushing.",
        type: 'alert'
      },
      {
        userId: seededStudents[0]._id,
        userType: 'student',
        title: '⭐ Shortlisted!',
        message: `Congratulations! You've been shortlisted for Razorpay (Associate Frontend Engineer)!`,
        type: 'shortlist',
        driveId: seededDrives[2]._id
      },
      {
        userId: seededStudents[1]._id,
        userType: 'student',
        title: '🏢 New Campus Drive!',
        message: `TCS is visiting on ${new Date(seededDrives[1].driveDate).toLocaleDateString('en-IN')} for Ninja & Digital Developer (7 LPA). You're 100% match! Register by ${new Date(seededDrives[1].registrationDeadline).toLocaleDateString('en-IN')}.`,
        type: 'drive',
        driveId: seededDrives[1]._id
      }
    ]);
    console.log('🔔 Seeded mock notifications.');
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
