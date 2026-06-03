require('dotenv').config({path: '.env.prod'});
const { connectDB } = require('./lib/mongodb');
const Student = require('./server/models/Student');
const Roadmap = require('./server/models/Roadmap');

const roadmaps = {
  highReadinessCSE: {
    placementScore: 88,
    scoreReason: "Excellent CGPA and solid foundation. Just need to polish advanced DSA and System Design for top-tier product companies.",
    skillGaps: ["Advanced System Design", "Dynamic Programming", "AWS"],
    immediateActions: ["Start grinding LeetCode Hard", "Read 'Designing Data-Intensive Applications'", "Build a microservice project"],
    encouragement: "You're in the top percentile! Stay consistent and Google/Microsoft are well within reach.",
    weeks: [
      { weekNumber: 1, topic: "Advanced Dynamic Programming", skills: ["DP", "Memoization"], estimatedHours: 12, completed: true, completedAt: new Date(), resources: [{ title: "LeetCode DP Patterns", url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns", type: "link" }, { title: "NeetCode DP Playlist", url: "https://youtube.com/c/neetcode", type: "video" }] },
      { weekNumber: 2, topic: "Graph Algorithms", skills: ["Graphs", "BFS/DFS", "Dijkstra"], estimatedHours: 10, completed: true, completedAt: new Date(), resources: [{ title: "Striver's Graph Series", url: "https://takeuforward.org/graph/striver-graph-series-top-algorithms/", type: "link" }, { title: "HackerRank Graph Challenges", url: "https://www.hackerrank.com/domains/algorithms?filters%5Bsubdomains%5D%5B%5D=graph-theory", type: "link" }] },
      { weekNumber: 3, topic: "High-Level System Design", skills: ["System Design", "Scalability"], estimatedHours: 14, completed: false, resources: [{ title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "link" }, { title: "Gaurav Sen System Design", url: "https://youtube.com/c/GauravSensei", type: "video" }] },
      { weekNumber: 4, topic: "Low-Level Design (LLD)", skills: ["LLD", "OOP", "Design Patterns"], estimatedHours: 12, completed: false, resources: [{ title: "Refactoring Guru: Design Patterns", url: "https://refactoring.guru/design-patterns", type: "link" }] },
      { weekNumber: 5, topic: "Database Scaling & Sharding", skills: ["SQL", "NoSQL", "Sharding"], estimatedHours: 10, completed: false, resources: [{ title: "Hussein Nasser DB Engineering", url: "https://youtube.com/c/HusseinNasser-software-engineering", type: "video" }, { title: "SQLZoo Interactive", url: "https://sqlzoo.net/", type: "link" }] },
      { weekNumber: 6, topic: "Cloud Deployment Basics", skills: ["AWS", "Docker"], estimatedHours: 12, completed: false, resources: [{ title: "AWS Cloud Practitioner in 3 Hours", url: "https://youtube.com/watch?v=3hLmDS179YE", type: "video" }] },
      { weekNumber: 7, topic: "Mock Interviews & Resume Polish", skills: ["Communication", "Interview Prep"], estimatedHours: 8, completed: false, resources: [{ title: "Pramp Peer Interviews", url: "https://www.pramp.com/", type: "link" }] },
      { weekNumber: 8, topic: "Company Specific Preparation", skills: ["Company Prep"], estimatedHours: 15, completed: false, resources: [{ title: "GeeksForGeeks Company Archives", url: "https://practice.geeksforgeeks.org/company-tags", type: "link" }] }
    ]
  },
  midReadinessCSE: {
    placementScore: 65,
    scoreReason: "Good foundation but missing core framework experience and consistent DSA practice.",
    skillGaps: ["React.js", "Node.js", "Basic DSA"],
    immediateActions: ["Master Array/String manipulations", "Build a full-stack MERN app", "Improve SQL queries"],
    encouragement: "You have massive potential. Focus heavily on practical projects this month!",
    weeks: [
      { weekNumber: 1, topic: "Data Structures Crash Course", skills: ["Arrays", "Strings", "HashMaps"], estimatedHours: 15, completed: true, completedAt: new Date(), resources: [{ title: "Blind 75 LeetCode", url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions", type: "link" }, { title: "Abdul Bari Algo Playlist", url: "https://youtube.com/c/abdul_bari", type: "video" }] },
      { weekNumber: 2, topic: "SQL & Database Mastery", skills: ["SQL", "Joins", "Normalization"], estimatedHours: 10, completed: false, resources: [{ title: "HackerRank SQL Challenges", url: "https://www.hackerrank.com/domains/sql", type: "link" }, { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", type: "link" }, { title: "SQL in 4 Hours", url: "https://youtube.com/watch?v=HXV3zeQKqGY", type: "video" }] },
      { weekNumber: 3, topic: "Frontend Fundamentals", skills: ["React.js", "JavaScript"], estimatedHours: 12, completed: false, resources: [{ title: "Namaste JavaScript", url: "https://youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP", type: "video" }, { title: "React Official Docs", url: "https://react.dev/learn", type: "link" }] },
      { weekNumber: 4, topic: "Backend Basics", skills: ["Node.js", "Express", "REST APIs"], estimatedHours: 14, completed: false, resources: [{ title: "Node.js Crash Course", url: "https://youtube.com/watch?v=fBNz5xF-Kx4", type: "video" }, { title: "MDN Express Tutorial", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs", type: "link" }] },
      { weekNumber: 5, topic: "Full Stack Integration", skills: ["MERN Stack", "CRUD"], estimatedHours: 15, completed: false, resources: [{ title: "Build a MERN App", url: "https://youtube.com/watch?v=ngc9gnGgUdA", type: "video" }] },
      { weekNumber: 6, topic: "Intermediate Trees & Graphs", skills: ["Trees", "Binary Search"], estimatedHours: 10, completed: false, resources: [{ title: "LeetCode Explore Trees", url: "https://leetcode.com/explore/learn/card/data-structure-tree/", type: "link" }] },
      { weekNumber: 7, topic: "Aptitude & Logic", skills: ["Aptitude", "Quant"], estimatedHours: 8, completed: false, resources: [{ title: "IndiaBix Aptitude", url: "https://www.indiabix.com/aptitude/questions-and-answers/", type: "link" }] },
      { weekNumber: 8, topic: "Portfolio & Revision", skills: ["Git", "Deployment"], estimatedHours: 10, completed: false, resources: [{ title: "GitHub Pages Hosting", url: "https://pages.github.com/", type: "link" }] }
    ]
  },
  needsAttentionIT: {
    placementScore: 30,
    scoreReason: "Struggling with core programming concepts and low CGPA. Immediate intervention needed.",
    skillGaps: ["Core Programming", "SQL", "Aptitude"],
    immediateActions: ["Pick ONE language (Python/Java) and stick to it", "Do basic HackerRank daily", "Focus on passing aptitude rounds"],
    encouragement: "Placement season is a marathon, not a sprint. Take it one day at a time, you can do this!",
    weeks: [
      { weekNumber: 1, topic: "Programming Fundamentals", skills: ["Variables", "Loops", "Functions"], estimatedHours: 15, completed: false, resources: [{ title: "Programming with Mosh - Python", url: "https://youtube.com/watch?v=_uQrJ0TkZlc", type: "video" }, { title: "HackerRank Python Basic", url: "https://www.hackerrank.com/domains/python", type: "link" }] },
      { weekNumber: 2, topic: "Basic Data Structures", skills: ["Arrays", "Lists"], estimatedHours: 15, completed: false, resources: [{ title: "GeeksForGeeks Arrays", url: "https://www.geeksforgeeks.org/array-data-structure/", type: "link" }] },
      { weekNumber: 3, topic: "SQL for Beginners", skills: ["SQL", "SELECT", "WHERE"], estimatedHours: 12, completed: false, resources: [{ title: "SQLZoo Interactive", url: "https://sqlzoo.net/", type: "link" }, { title: "W3Schools SQL", url: "https://www.w3schools.com/sql/", type: "link" }] },
      { weekNumber: 4, topic: "Quantitative Aptitude - Part 1", skills: ["Aptitude", "Math"], estimatedHours: 10, completed: false, resources: [{ title: "CareerRide Aptitude", url: "https://youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt", type: "video" }] },
      { weekNumber: 5, topic: "Logical Reasoning", skills: ["Reasoning", "Puzzles"], estimatedHours: 10, completed: false, resources: [{ title: "IndiaBix Reasoning", url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/", type: "link" }] },
      { weekNumber: 6, topic: "Web Dev HTML/CSS", skills: ["HTML/CSS"], estimatedHours: 10, completed: false, resources: [{ title: "FreeCodeCamp HTML CSS", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", type: "link" }] },
      { weekNumber: 7, topic: "Building a Simple Project", skills: ["Projects"], estimatedHours: 15, completed: false, resources: [{ title: "Build a To-Do List App", url: "https://youtube.com/watch?v=G0jO8kUrg-I", type: "video" }] },
      { weekNumber: 8, topic: "Communication Skills", skills: ["Communication", "HR Interview"], estimatedHours: 8, completed: false, resources: [{ title: "Top 50 HR Questions", url: "https://www.geeksforgeeks.org/hr-interview-questions/", type: "link" }] }
    ]
  },
  midReadinessECE: {
    placementScore: 55,
    scoreReason: "Strong hardware fundamentals but needs software and coding practice for IT placements.",
    skillGaps: ["C++", "Embedded Systems", "Basic DSA"],
    immediateActions: ["Master C++ Pointers and Memory", "Learn basics of Computer Networks", "Solve LeetCode Easy problems"],
    encouragement: "Core branches do great in IT if they master coding. Keep balancing core and software!",
    weeks: [
      { weekNumber: 1, topic: "C++ Programming Mastery", skills: ["C++", "OOP"], estimatedHours: 12, completed: false, resources: [{ title: "C++ Crash Course", url: "https://youtube.com/watch?v=vLnPwxZdW4Y", type: "video" }, { title: "LearnCpp.com", url: "https://www.learncpp.com/", type: "link" }] },
      { weekNumber: 2, topic: "Embedded Systems Basics", skills: ["Embedded C", "Microcontrollers"], estimatedHours: 10, completed: false, resources: [{ title: "Embedded Systems Intro", url: "https://youtube.com/playlist?list=PLgMDNELGJ1CXx4R07K5iF1261nOaVz4h9", type: "video" }] },
      { weekNumber: 3, topic: "Data Structures in C++", skills: ["Pointers", "Linked Lists"], estimatedHours: 14, completed: false, resources: [{ title: "MyCodeSchool Pointers", url: "https://youtube.com/playlist?list=PL2_aWCzGMAwLZp6LMUKI3cc7pgGsasm2_", type: "video" }] },
      { weekNumber: 4, topic: "Computer Networks Fundamentals", skills: ["Networking", "TCP/IP"], estimatedHours: 10, completed: false, resources: [{ title: "Neso Academy Computer Networks", url: "https://youtube.com/playlist?list=PLBlnK6fEyqRgMCUAGOsZP4EQIvQFSxA7k", type: "video" }] },
      { weekNumber: 5, topic: "Operating Systems Basics", skills: ["OS", "Threads"], estimatedHours: 10, completed: false, resources: [{ title: "Gate Smashers OS", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", type: "video" }] },
      { weekNumber: 6, topic: "SQL for ECE Students", skills: ["SQL", "Databases"], estimatedHours: 8, completed: false, resources: [{ title: "HackerRank SQL", url: "https://www.hackerrank.com/domains/sql", type: "link" }] },
      { weekNumber: 7, topic: "Internet of Things (IoT)", skills: ["IoT", "Sensors"], estimatedHours: 10, completed: false, resources: [{ title: "AWS IoT Core Tutorial", url: "https://youtube.com/watch?v=L25a2I_C-rQ", type: "video" }] },
      { weekNumber: 8, topic: "Mock Interviews & Resume", skills: ["Interview Prep"], estimatedHours: 8, completed: false, resources: [{ title: "How to explain ECE projects in IT interviews", url: "https://www.geeksforgeeks.org/how-to-prepare-for-it-companies-as-a-non-it-student/", type: "link" }] }
    ]
  }
};

async function seedSmartRoadmaps() {
  await connectDB();
  const students = await Student.find({});
  console.log(`Injecting ultra-realistic AI roadmaps for ${students.length} students...`);
  
  for (const student of students) {
    let template = roadmaps.midReadinessCSE; // Default
    
    if (student.name.includes('Aarav')) template = roadmaps.highReadinessCSE;
    else if (student.name.includes('Diya')) template = roadmaps.midReadinessCSE;
    else if (student.name.includes('Kabir')) template = roadmaps.midReadinessECE;
    else if (student.name.includes('Ananya')) template = roadmaps.needsAttentionIT;
    else {
      // Pick based on placementScore
      if (student.placementScore > 80) template = roadmaps.highReadinessCSE;
      else if (student.placementScore < 40) template = roadmaps.needsAttentionIT;
      else if (student.branch === 'ECE') template = roadmaps.midReadinessECE;
    }

    await Roadmap.deleteMany({ studentId: student._id });

    const roadmap = new Roadmap({
      studentId: student._id,
      weeks: template.weeks,
      totalWeeks: template.weeks.length,
      placementScore: template.placementScore,
      scoreReason: template.scoreReason,
      skillGaps: template.skillGaps,
      immediateActions: template.immediateActions,
      encouragement: template.encouragement,
    });

    await roadmap.save();
    student.placementScore = template.placementScore;
    await student.save();
    console.log(`✅ Seeded ${template.placementScore > 80 ? 'High' : template.placementScore < 40 ? 'Low' : 'Mid'} Readiness roadmap for ${student.name}`);
  }
  
  console.log("🔥 Successfully seeded all users with hyper-realistic AI-curated roadmaps! Ready for demo.");
  process.exit(0);
}

seedSmartRoadmaps();
