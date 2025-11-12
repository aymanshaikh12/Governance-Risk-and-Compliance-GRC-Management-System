const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

// Get all assessments
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      framework,
      status,
      type,
      search
    } = req.query;

    const filter = {};
    
    if (framework) filter.framework = framework;
    if (status) filter.status = status;
    if (type) filter.type = type;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { assessmentId: { $regex: search, $options: 'i' } }
      ];
    }

    const assessments = await Assessment.find(filter)
      .populate('framework', 'name version type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Assessment.countDocuments(filter);

    res.json({
      assessments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assessment by ID
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('framework', 'name version type controls');
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new assessment
router.post('/', async (req, res) => {
  try {
    // Generate unique assessment ID
    const assessmentCount = await Assessment.countDocuments();
    const assessmentId = `ASSESS-${String(assessmentCount + 1).padStart(4, '0')}`;
    
    const assessmentData = {
      ...req.body,
      assessmentId
    };
    
    const assessment = new Assessment(assessmentData);
    await assessment.save();
    
    res.status(201).json(assessment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update assessment
router.put('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete assessment
router.delete('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add assessment result
router.post('/:id/results', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $push: { results: req.body } },
      { new: true, runValidators: true }
    );
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update assessment result
router.put('/:id/results/:resultId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    const result = assessment.results.id(req.params.resultId);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    Object.assign(result, req.body);
    await assessment.save();
    
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete assessment result
router.delete('/:id/results/:resultId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    assessment.results.id(req.params.resultId).remove();
    await assessment.save();
    
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assessment statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Assessment.aggregate([
      {
        $group: {
          _id: null,
          totalAssessments: { $sum: 1 },
          avgCompliancePercentage: { $avg: '$compliancePercentage' },
          completedAssessments: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          inProgressAssessments: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          plannedAssessments: {
            $sum: { $cond: [{ $eq: ['$status', 'Planned'] }, 1, 0] }
          }
        }
      }
    ]);

    const riskLevelStats = await Assessment.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    const frameworkStats = await Assessment.aggregate([
      {
        $group: {
          _id: '$framework',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'complianceframeworks',
          localField: '_id',
          foreignField: '_id',
          as: 'framework'
        }
      }
    ]);

    res.json({
      overview: stats[0] || {
        totalAssessments: 0,
        avgCompliancePercentage: 0,
        completedAssessments: 0,
        inProgressAssessments: 0,
        plannedAssessments: 0
      },
      riskLevelDistribution: riskLevelStats,
      frameworkDistribution: frameworkStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start assessment
router.patch('/:id/start', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'In Progress',
        actualStartDate: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Complete assessment
router.patch('/:id/complete', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Completed',
        actualEndDate: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add recommendation
router.post('/:id/recommendations', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $push: { recommendations: req.body } },
      { new: true, runValidators: true }
    );
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update recommendation
router.put('/:id/recommendations/:recommendationId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    const recommendation = assessment.recommendations.id(req.params.recommendationId);
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    
    Object.assign(recommendation, req.body);
    await assessment.save();
    
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
