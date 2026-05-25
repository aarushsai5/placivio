const { connectDB } = require('../../../../lib/mongodb');
const Company = require('../../../../lib/models/Company');
const Student = require('../../../../lib/models/Student');
const { calculateMatch, getMostImpactfulSkill } = require('../../../../lib/alerts');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    
    const { studentId } = req.query;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const companies = await Company.find({});

    const companiesWithMatch = companies.map(company => {
      const matchPercent = calculateMatch(student.skills, company.requiredSkills);

      // Find which skills are matched and which are missing
      const normalizedStudent = student.skills.map(s => s.toLowerCase().trim());
      const matchedSkills = (company.requiredSkills || []).filter(cs =>
        normalizedStudent.some(ss =>
          ss === cs.toLowerCase().trim() ||
          ss.includes(cs.toLowerCase().trim()) ||
          cs.toLowerCase().trim().includes(ss)
        )
      );
      const missingSkills = (company.requiredSkills || []).filter(cs =>
        !normalizedStudent.some(ss =>
          ss === cs.toLowerCase().trim() ||
          ss.includes(cs.toLowerCase().trim()) ||
          cs.toLowerCase().trim().includes(ss)
        )
      );

      // Find the most impactful missing skill for this specific company
      const boostSkill = missingSkills.length > 0 ? missingSkills[0] : null;

      return {
        _id: company._id,
        name: company.name,
        type: company.type,
        requiredSkills: company.requiredSkills,
        cgpaCutoff: company.cgpaCutoff,
        branchesAllowed: company.branchesAllowed,
        matchPercent,
        matchedSkills,
        missingSkills,
        boostSkill,
        cgpaEligible: student.cgpa >= company.cgpaCutoff,
        branchEligible: company.branchesAllowed.includes(student.branch),
      };
    });

    // Sort by match percentage (highest first)
    companiesWithMatch.sort((a, b) => b.matchPercent - a.matchPercent);

    res.json({
      companies: companiesWithMatch,
      studentSkills: student.skills,
      topBoostSkill: getMostImpactfulSkill(student.skills, companies),
    });
  } catch (error) {
    console.error('❌ Error fetching company matches:', error.message);
    res.status(500).json({ error: 'Failed to load company data.' });
  }
};
