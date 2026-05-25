const Company = require('../models/Company');

const companies = [
  {
    name: 'Google',
    type: 'product',
    requiredSkills: ['DSA', 'System Design', 'JavaScript', 'Python', 'ML', 'React'],
    cgpaCutoff: 7.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS'],
    visitsColleges: [],
  },
  {
    name: 'Microsoft',
    type: 'product',
    requiredSkills: ['DSA', 'C++', 'System Design', 'Azure', '.NET', 'SQL'],
    cgpaCutoff: 7.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS', 'ECE'],
    visitsColleges: [],
  },
  {
    name: 'Amazon',
    type: 'product',
    requiredSkills: ['DSA', 'System Design', 'Java', 'AWS', 'Leadership Principles'],
    cgpaCutoff: 6.5,
    branchesAllowed: ['CSE', 'IT', 'CSBS'],
    visitsColleges: [],
  },
  {
    name: 'TCS',
    type: 'service',
    requiredSkills: ['Java', 'SQL', 'Aptitude', 'Communication', 'Python'],
    cgpaCutoff: 6.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS', 'ECE', 'ME', 'CE'],
    visitsColleges: [],
  },
  {
    name: 'Infosys',
    type: 'service',
    requiredSkills: ['Java', 'Python', 'SQL', 'Aptitude', 'Communication'],
    cgpaCutoff: 6.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS', 'ECE', 'ME', 'CE'],
    visitsColleges: [],
  },
  {
    name: 'Wipro',
    type: 'service',
    requiredSkills: ['Java', 'SQL', 'Aptitude', 'Communication'],
    cgpaCutoff: 6.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS', 'ECE', 'ME', 'CE'],
    visitsColleges: [],
  },
  {
    name: 'Flipkart',
    type: 'product',
    requiredSkills: ['DSA', 'Java', 'System Design', 'React', 'Node.js'],
    cgpaCutoff: 7.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS'],
    visitsColleges: [],
  },
  {
    name: 'Razorpay',
    type: 'startup',
    requiredSkills: ['DSA', 'Go', 'React', 'Node.js', 'System Design', 'AWS'],
    cgpaCutoff: 7.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS'],
    visitsColleges: [],
  },
  {
    name: 'Zomato',
    type: 'startup',
    requiredSkills: ['DSA', 'Python', 'React', 'Node.js', 'MongoDB', 'Redis'],
    cgpaCutoff: 6.5,
    branchesAllowed: ['CSE', 'IT', 'CSBS'],
    visitsColleges: [],
  },
  {
    name: 'PhonePe',
    type: 'startup',
    requiredSkills: ['DSA', 'Java', 'Spring Boot', 'Microservices', 'Kafka'],
    cgpaCutoff: 7.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS'],
    visitsColleges: [],
  },
  {
    name: 'Accenture',
    type: 'service',
    requiredSkills: ['Java', 'SQL', 'Cloud', 'Aptitude', 'Communication'],
    cgpaCutoff: 6.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS', 'ECE', 'ME', 'CE'],
    visitsColleges: [],
  },
  {
    name: 'Deloitte',
    type: 'service',
    requiredSkills: ['SQL', 'Python', 'Analytics', 'Communication', 'Excel'],
    cgpaCutoff: 7.0,
    branchesAllowed: ['CSE', 'IT', 'CSBS', 'ECE'],
    visitsColleges: [],
  },
  {
    name: 'Adobe',
    type: 'product',
    requiredSkills: ['DSA', 'C++', 'JavaScript', 'React', 'System Design'],
    cgpaCutoff: 7.5,
    branchesAllowed: ['CSE', 'IT', 'CSBS'],
    visitsColleges: [],
  },
  {
    name: 'Paytm',
    type: 'startup',
    requiredSkills: ['Java', 'DSA', 'React', 'Node.js', 'MongoDB', 'AWS'],
    cgpaCutoff: 6.5,
    branchesAllowed: ['CSE', 'IT', 'CSBS'],
    visitsColleges: [],
  },
  {
    name: 'CRED',
    type: 'startup',
    requiredSkills: ['DSA', 'Kotlin', 'React Native', 'Node.js', 'System Design'],
    cgpaCutoff: 7.5,
    branchesAllowed: ['CSE', 'IT', 'CSBS'],
    visitsColleges: [],
  },
];

async function seedCompanies() {
  try {
    const count = await Company.countDocuments();
    if (count > 0) {
      console.log(`📋 Companies already seeded (${count} found). Skipping.`);
      return;
    }
    await Company.insertMany(companies, { ordered: false });
    console.log(`✅ Seeded ${companies.length} companies successfully.`);
  } catch (error) {
    if (error.code === 11000) {
      console.log('📋 Some companies already exist. Skipping duplicates.');
    } else {
      console.error('❌ Error seeding companies:', error.message);
    }
  }
}

module.exports = seedCompanies;
