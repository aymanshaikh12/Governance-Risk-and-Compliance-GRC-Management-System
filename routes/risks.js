const express = require('express');
const router = express.Router();
const Risk = require('../models/Risk');

// Get all risks with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      riskLevel,
      treatment,
      status,
      businessUnit,
      search
    } = req.query;

    const filter = {};
    
    if (category) filter.category = category;
    if (riskLevel) filter.riskLevel = riskLevel;
    if (treatment) filter.treatment = treatment;
    if (status) filter.status = status;
    if (businessUnit) filter.businessUnit = businessUnit;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { riskId: { $regex: search, $options: 'i' } }
      ];
    }

    const risks = await Risk.find(filter)
      .sort({ riskScore: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('complianceFrameworks.framework', 'name version');

    const total = await Risk.countDocuments(filter);

    res.json({
      risks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get risk by ID
router.get('/:id', async (req, res) => {
  try {
    const risk = await Risk.findById(req.params.id)
      .populate('complianceFrameworks.framework', 'name version');
    
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    
    res.json(risk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new risk
router.post('/', async (req, res) => {
  try {
    // Generate unique risk ID
    const riskCount = await Risk.countDocuments();
    const riskId = `RISK-${String(riskCount + 1).padStart(4, '0')}`;
    
    const riskData = {
      ...req.body,
      riskId
    };
    
    const risk = new Risk(riskData);
    await risk.save();
    
    res.status(201).json(risk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update risk
router.put('/:id', async (req, res) => {
  try {
    const risk = await Risk.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    
    res.json(risk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete risk
router.delete('/:id', async (req, res) => {
  try {
    const risk = await Risk.findByIdAndDelete(req.params.id);
    
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    
    res.json({ message: 'Risk deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get risk statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Risk.aggregate([
      {
        $group: {
          _id: null,
          totalRisks: { $sum: 1 },
          avgRiskScore: { $avg: '$riskScore' },
          criticalRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'Critical'] }, 1, 0] }
          },
          highRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'High'] }, 1, 0] }
          },
          mediumRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'Medium'] }, 1, 0] }
          },
          lowRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'Low'] }, 1, 0] }
          },
          veryLowRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'Very Low'] }, 1, 0] }
          }
        }
      }
    ]);

    const treatmentStats = await Risk.aggregate([
      {
        $group: {
          _id: '$treatment',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Risk.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      overview: stats[0] || {
        totalRisks: 0,
        avgRiskScore: 0,
        criticalRisks: 0,
        highRisks: 0,
        mediumRisks: 0,
        lowRisks: 0,
        veryLowRisks: 0
      },
      treatmentDistribution: treatmentStats,
      categoryDistribution: categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get risks by compliance framework
router.get('/framework/:frameworkId', async (req, res) => {
  try {
    const risks = await Risk.find({
      'complianceFrameworks.framework': req.params.frameworkId
    }).populate('complianceFrameworks.framework', 'name version');
    
    res.json(risks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update risk treatment
router.patch('/:id/treatment', async (req, res) => {
  try {
    const { treatment, treatmentDescription, treatmentOwner, treatmentDueDate, treatmentCost } = req.body;
    
    const risk = await Risk.findByIdAndUpdate(
      req.params.id,
      {
        treatment,
        treatmentDescription,
        treatmentOwner,
        treatmentDueDate,
        treatmentCost,
        treatmentStatus: 'Planned'
      },
      { new: true, runValidators: true }
    );
    
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    
    res.json(risk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update residual risk assessment
router.patch('/:id/residual', async (req, res) => {
  try {
    const { residualLikelihood, residualLikelihoodScore, residualImpact, residualImpactScore } = req.body;
    
    const risk = await Risk.findByIdAndUpdate(
      req.params.id,
      {
        residualLikelihood,
        residualLikelihoodScore,
        residualImpact,
        residualImpactScore
      },
      { new: true, runValidators: true }
    );
    
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    
    res.json(risk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
