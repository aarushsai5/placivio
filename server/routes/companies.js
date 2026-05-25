const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Student = require('../models/Student');
const { calculateMatch, getMostImpactfulSkill } = require('../services/alerts');

// GET /api/companies/match/:studentId — Get all companies with match percentages
router.get('/match/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
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
});

// GET /api/companies — Get all companies (no auth required)
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    console.error('❌ Error fetching companies:', error.message);
    res.status(500).json({ error: 'Failed to load companies.' });
  }
});

module.exports = router;
