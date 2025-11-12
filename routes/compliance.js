const express = require('express');
const router = express.Router();
const Risk = require('../models/Risk');
const Assessment = require('../models/Assessment');
const ComplianceFramework = require('../models/ComplianceFramework');

// Get compliance dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // Get risk statistics
    const riskStats = await Risk.aggregate([
      {
        $group: {
          _id: null,
          totalRisks: { $sum: 1 },
          criticalRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'Critical'] }, 1, 0] }
          },
          highRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'High'] }, 1, 0] }
          },
          mediumRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'Medium'] }, 1, 0] }
          },
          avgRiskScore: { $avg: '$riskScore' }
        }
      }
    ]);

    // Get assessment statistics
    const assessmentStats = await Assessment.aggregate([
      {
        $group: {
          _id: null,
          totalAssessments: { $sum: 1 },
          completedAssessments: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          inProgressAssessments: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          avgCompliancePercentage: { $avg: '$compliancePercentage' }
        }
      }
    ]);

    // Get framework statistics
    const frameworkStats = await ComplianceFramework.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent activities
    const recentRisks = await Risk.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title riskLevel createdAt');

    const recentAssessments = await Assessment.find()
      .populate('framework', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name status framework createdAt');

    // Get upcoming reviews
    const upcomingReviews = await Risk.find({
      nextReviewDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      status: 'Active'
    })
      .sort({ nextReviewDate: 1 })
      .limit(10)
      .select('title riskLevel nextReviewDate');

    res.json({
      riskStats: riskStats[0] || {
        totalRisks: 0,
        criticalRisks: 0,
        highRisks: 0,
        mediumRisks: 0,
        avgRiskScore: 0
      },
      assessmentStats: assessmentStats[0] || {
        totalAssessments: 0,
        completedAssessments: 0,
        inProgressAssessments: 0,
        avgCompliancePercentage: 0
      },
      frameworkStats,
      recentActivities: {
        risks: recentRisks,
        assessments: recentAssessments
      },
      upcomingReviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get compliance status by framework
router.get('/status/:frameworkId', async (req, res) => {
  try {
    const framework = await ComplianceFramework.findById(req.params.frameworkId);
    
    if (!framework) {
      return res.status(404).json({ message: 'Framework not found' });
    }

    // Get assessments for this framework
    const assessments = await Assessment.find({ framework: req.params.frameworkId })
      .sort({ createdAt: -1 });

    // Get risks mapped to this framework
    const risks = await Risk.find({
      'complianceFrameworks.framework': req.params.frameworkId
    });

    // Calculate compliance metrics
    const totalControls = framework.controls.length;
    const assessedControls = assessments.reduce((sum, assessment) => {
      return sum + assessment.results.length;
    }, 0);

    const compliantControls = assessments.reduce((sum, assessment) => {
      return sum + assessment.results.filter(result => result.status === 'Compliant').length;
    }, 0);

    const compliancePercentage = totalControls > 0 ? (compliantControls / totalControls) * 100 : 0;

    // Get risk distribution for this framework
    const riskDistribution = risks.reduce((acc, risk) => {
      acc[risk.riskLevel] = (acc[risk.riskLevel] || 0) + 1;
      return acc;
    }, {});

    res.json({
      framework: {
        id: framework._id,
        name: framework.name,
        version: framework.version,
        type: framework.type
      },
      compliance: {
        totalControls,
        assessedControls,
        compliantControls,
        compliancePercentage: Math.round(compliancePercentage * 100) / 100
      },
      riskDistribution,
      assessments: assessments.map(assessment => ({
        id: assessment._id,
        name: assessment.name,
        status: assessment.status,
        compliancePercentage: assessment.compliancePercentage,
        createdAt: assessment.createdAt
      })),
      risks: risks.map(risk => ({
        id: risk._id,
        title: risk.title,
        riskLevel: risk.riskLevel,
        treatment: risk.treatment,
        status: risk.status
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get compliance trends
router.get('/trends', async (req, res) => {
  try {
    const { months = 12 } = req.query;
    
    // Get compliance trends over time
    const complianceTrends = await Assessment.aggregate([
      {
        $match: {
          status: 'Completed',
          createdAt: {
            $gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          avgCompliance: { $avg: '$compliancePercentage' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get risk trends over time
    const riskTrends = await Risk.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRisks: { $sum: 1 },
          criticalRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'Critical'] }, 1, 0] }
          },
          highRisks: {
            $sum: { $cond: [{ $eq: ['$riskLevel', 'High'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      complianceTrends,
      riskTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get compliance gaps
router.get('/gaps', async (req, res) => {
  try {
    const { frameworkId } = req.query;
    
    let matchQuery = {};
    if (frameworkId) {
      matchQuery.framework = frameworkId;
    }

    // Get assessments with gaps
    const assessments = await Assessment.find({
      ...matchQuery,
      status: 'Completed'
    }).populate('framework', 'name version');

    const gaps = [];

    assessments.forEach(assessment => {
      const nonCompliantResults = assessment.results.filter(
        result => result.status === 'Non-Compliant' || result.status === 'Partially Compliant'
      );

      nonCompliantResults.forEach(result => {
        gaps.push({
          assessmentId: assessment._id,
          assessmentName: assessment.name,
          framework: assessment.framework.name,
          controlId: result.controlId,
          controlTitle: result.controlTitle,
          status: result.status,
          findings: result.findings,
          priority: result.findings[0]?.priority || 'Medium',
          assessedDate: result.assessedDate
        });
      });
    });

    // Sort by priority
    const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    gaps.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));

    res.json(gaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate compliance report
router.post('/report', async (req, res) => {
  try {
    const { frameworkId, startDate, endDate, includeRisks = true, includeAssessments = true } = req.body;

    const report = {
      generatedAt: new Date(),
      period: {
        startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: endDate ? new Date(endDate) : new Date()
      }
    };

    // Get framework information
    if (frameworkId) {
      const framework = await ComplianceFramework.findById(frameworkId);
      report.framework = framework;
    }

    // Get risk data
    if (includeRisks) {
      const riskQuery = {
        createdAt: {
          $gte: report.period.startDate,
          $lte: report.period.endDate
        }
      };
      
      if (frameworkId) {
        riskQuery['complianceFrameworks.framework'] = frameworkId;
      }

      const risks = await Risk.find(riskQuery);
      
      report.risks = {
        total: risks.length,
        byLevel: risks.reduce((acc, risk) => {
          acc[risk.riskLevel] = (acc[risk.riskLevel] || 0) + 1;
          return acc;
        }, {}),
        byTreatment: risks.reduce((acc, risk) => {
          acc[risk.treatment] = (acc[risk.treatment] || 0) + 1;
          return acc;
        }, {}),
        details: risks
      };
    }

    // Get assessment data
    if (includeAssessments) {
      const assessmentQuery = {
        createdAt: {
          $gte: report.period.startDate,
          $lte: report.period.endDate
        }
      };
      
      if (frameworkId) {
        assessmentQuery.framework = frameworkId;
      }

      const assessments = await Assessment.find(assessmentQuery).populate('framework', 'name version');
      
      report.assessments = {
        total: assessments.length,
        completed: assessments.filter(a => a.status === 'Completed').length,
        inProgress: assessments.filter(a => a.status === 'In Progress').length,
        avgCompliance: assessments.reduce((sum, a) => sum + (a.compliancePercentage || 0), 0) / assessments.length || 0,
        details: assessments
      };
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
