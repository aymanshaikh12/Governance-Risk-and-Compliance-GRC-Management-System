const express = require('express');
const router = express.Router();
const ComplianceFramework = require('../models/ComplianceFramework');

// Get all compliance frameworks
router.get('/', async (req, res) => {
  try {
    const { type, status, search } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const frameworks = await ComplianceFramework.find(filter).sort({ name: 1 });
    res.json(frameworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get framework by ID
router.get('/:id', async (req, res) => {
  try {
    const framework = await ComplianceFramework.findById(req.params.id);
    
    if (!framework) {
      return res.status(404).json({ message: 'Framework not found' });
    }
    
    res.json(framework);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new compliance framework
router.post('/', async (req, res) => {
  try {
    const framework = new ComplianceFramework(req.body);
    await framework.save();
    res.status(201).json(framework);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update framework
router.put('/:id', async (req, res) => {
  try {
    const framework = await ComplianceFramework.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!framework) {
      return res.status(404).json({ message: 'Framework not found' });
    }
    
    res.json(framework);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete framework
router.delete('/:id', async (req, res) => {
  try {
    const framework = await ComplianceFramework.findByIdAndDelete(req.params.id);
    
    if (!framework) {
      return res.status(404).json({ message: 'Framework not found' });
    }
    
    res.json({ message: 'Framework deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get framework controls
router.get('/:id/controls', async (req, res) => {
  try {
    const framework = await ComplianceFramework.findById(req.params.id);
    
    if (!framework) {
      return res.status(404).json({ message: 'Framework not found' });
    }
    
    res.json(framework.controls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add control to framework
router.post('/:id/controls', async (req, res) => {
  try {
    const framework = await ComplianceFramework.findByIdAndUpdate(
      req.params.id,
      { $push: { controls: req.body } },
      { new: true, runValidators: true }
    );
    
    if (!framework) {
      return res.status(404).json({ message: 'Framework not found' });
    }
    
    res.json(framework);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update control in framework
router.put('/:id/controls/:controlId', async (req, res) => {
  try {
    const framework = await ComplianceFramework.findById(req.params.id);
    
    if (!framework) {
      return res.status(404).json({ message: 'Framework not found' });
    }
    
    const control = framework.controls.id(req.params.controlId);
    if (!control) {
      return res.status(404).json({ message: 'Control not found' });
    }
    
    Object.assign(control, req.body);
    await framework.save();
    
    res.json(framework);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete control from framework
router.delete('/:id/controls/:controlId', async (req, res) => {
  try {
    const framework = await ComplianceFramework.findById(req.params.id);
    
    if (!framework) {
      return res.status(404).json({ message: 'Framework not found' });
    }
    
    framework.controls.id(req.params.controlId).remove();
    await framework.save();
    
    res.json(framework);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload framework from file
router.post('/upload', async (req, res) => {
  try {
    let frameworkData;
    
    // Handle JSON file upload
    if (req.body.frameworkData) {
      const { frameworkData: data, type } = req.body;
      frameworkData = { ...data, type: type || data.type || 'Custom' };
    } else {
      // Handle direct JSON upload
      frameworkData = req.body;
    }
    
    // Check if framework already exists
    const existingFramework = await ComplianceFramework.findOne({ name: frameworkData.name });
    
    if (existingFramework) {
      // Update existing framework
      const updatedFramework = await ComplianceFramework.findByIdAndUpdate(
        existingFramework._id,
        {
          version: frameworkData.version || existingFramework.version,
          description: frameworkData.description || existingFramework.description,
          type: frameworkData.type || existingFramework.type,
          controls: frameworkData.controls || existingFramework.controls,
          assessmentCriteria: frameworkData.assessmentCriteria || existingFramework.assessmentCriteria,
          publisher: frameworkData.publisher || existingFramework.publisher,
          website: frameworkData.website || existingFramework.website,
          tags: frameworkData.tags || existingFramework.tags,
          industry: frameworkData.industry || existingFramework.industry,
          region: frameworkData.region || existingFramework.region,
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );
      
      res.status(200).json({ 
        message: 'Framework updated successfully',
        framework: updatedFramework,
        action: 'updated'
      });
    } else {
      // Create new framework
      const framework = new ComplianceFramework({
        name: frameworkData.name || 'Uploaded Framework',
        version: frameworkData.version || '1.0',
        description: frameworkData.description || 'Uploaded framework',
        type: frameworkData.type || 'Custom',
        controls: frameworkData.controls || [],
        assessmentCriteria: frameworkData.assessmentCriteria || {
          frequency: 'Annually',
          methodology: 'Custom',
          scoringMethod: 'Pass/Fail',
          thresholds: { pass: 80, warning: 60, fail: 40 }
        },
        publisher: frameworkData.publisher || 'Custom',
        website: frameworkData.website || '',
        tags: frameworkData.tags || [],
        industry: frameworkData.industry || [],
        region: frameworkData.region || []
      });
      
      await framework.save();
      res.status(201).json({ 
        message: 'Framework created successfully',
        framework: framework,
        action: 'created'
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Initialize default frameworks
router.post('/initialize', async (req, res) => {
  try {
    // Check if frameworks already exist
    const existingFrameworks = await ComplianceFramework.countDocuments();
    if (existingFrameworks > 0) {
      return res.json({ message: 'Frameworks already initialized' });
    }
    
    // Initialize ISO 27005 framework
    const iso27005 = new ComplianceFramework({
      name: 'ISO 27005',
      version: '2018',
      description: 'Information security risk management standard',
      type: 'Cybersecurity',
      controls: [
        {
          controlId: 'A.5.1.1',
          title: 'Information Security Policies',
          description: 'Management direction and support for information security',
          category: 'Governance',
          priority: 'High',
          requirements: [
            'Documented information security policies',
            'Regular policy review and updates',
            'Policy communication to all stakeholders'
          ]
        },
        {
          controlId: 'A.6.1.1',
          title: 'Information Security Roles and Responsibilities',
          description: 'All information security responsibilities shall be defined and allocated',
          category: 'Organization',
          priority: 'High',
          requirements: [
            'Clear role definitions',
            'Responsibility allocation',
            'Regular role reviews'
          ]
        }
      ],
      assessmentCriteria: {
        frequency: 'Annually',
        methodology: 'Risk-based assessment',
        scoringMethod: 'Weighted Score',
        thresholds: {
          pass: 80,
          warning: 60,
          fail: 40
        }
      }
    });
    
    // Initialize NIST RMF framework
    const nistRMF = new ComplianceFramework({
      name: 'NIST RMF',
      version: '2.0',
      description: 'Risk Management Framework for Information Systems and Organizations',
      type: 'Cybersecurity',
      controls: [
        {
          controlId: 'AC-1',
          title: 'Access Control Policy and Procedures',
          description: 'Develop, document, and disseminate access control policy and procedures',
          category: 'Access Control',
          priority: 'High',
          requirements: [
            'Documented access control policy',
            'Procedures for access control implementation',
            'Regular policy updates'
          ]
        },
        {
          controlId: 'AC-2',
          title: 'Account Management',
          description: 'Manage information system accounts',
          category: 'Access Control',
          priority: 'High',
          requirements: [
            'Account identification and naming',
            'Account establishment and activation',
            'Account modification and termination'
          ]
        }
      ],
      assessmentCriteria: {
        frequency: 'Quarterly',
        methodology: 'Continuous monitoring',
        scoringMethod: 'Pass/Fail',
        thresholds: {
          pass: 100,
          warning: 80,
          fail: 60
        }
      }
    });
    
    // Initialize GDPR framework
    const gdpr = new ComplianceFramework({
      name: 'GDPR',
      version: '2018',
      description: 'General Data Protection Regulation',
      type: 'Data Protection',
      controls: [
        {
          controlId: 'Art. 5',
          title: 'Principles relating to processing of personal data',
          description: 'Personal data shall be processed lawfully, fairly and in a transparent manner',
          category: 'Data Processing',
          priority: 'Critical',
          requirements: [
            'Lawfulness of processing',
            'Fairness and transparency',
            'Purpose limitation',
            'Data minimization',
            'Accuracy',
            'Storage limitation',
            'Integrity and confidentiality'
          ]
        },
        {
          controlId: 'Art. 25',
          title: 'Data protection by design and by default',
          description: 'Implement appropriate technical and organizational measures',
          category: 'Technical Measures',
          priority: 'High',
          requirements: [
            'Privacy by design implementation',
            'Data protection by default',
            'Technical and organizational measures'
          ]
        }
      ],
      assessmentCriteria: {
        frequency: 'Semi-Annually',
        methodology: 'Compliance assessment',
        scoringMethod: 'Pass/Fail',
        thresholds: {
          pass: 100,
          warning: 90,
          fail: 80
        }
      }
    });
    
    await Promise.all([iso27005.save(), nistRMF.save(), gdpr.save()]);
    
    res.status(201).json({ 
      message: 'Default frameworks initialized successfully',
      frameworks: [iso27005, nistRMF, gdpr]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
