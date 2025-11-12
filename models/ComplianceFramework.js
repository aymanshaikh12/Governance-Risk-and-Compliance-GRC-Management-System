const mongoose = require('mongoose');

const ComplianceFrameworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  version: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Cybersecurity', 'Data Protection', 'Financial', 'Operational', 'Industry Specific', 'Custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Deprecated'],
    default: 'Active'
  },
  
  // Framework-specific properties
  controls: [{
    controlId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    category: String,
    subCategory: String,
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low']
    },
    requirements: [String],
    implementationGuidance: String,
    testingProcedures: [String],
    evidenceTypes: [String]
  }],
  
  // Compliance requirements
  requirements: [{
    requirementId: String,
    title: String,
    description: String,
    category: String,
    mandatory: {
      type: Boolean,
      default: true
    },
    applicableTo: [String], // Business units, systems, etc.
    evidenceRequired: [String]
  }],
  
  // Assessment criteria
  assessmentCriteria: {
    frequency: {
      type: String,
      enum: ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually', 'As Needed']
    },
    methodology: String,
    scoringMethod: {
      type: String,
      enum: ['Pass/Fail', 'Percentage', 'Weighted Score', 'Custom']
    },
    thresholds: {
      pass: Number,
      warning: Number,
      fail: Number
    }
  },
  
  // Integration settings
  integrationSettings: {
    apiEndpoint: String,
    authenticationMethod: String,
    syncFrequency: String,
    customFields: [{
      name: String,
      type: String,
      required: Boolean
    }]
  },
  
  // Metadata
  publisher: String,
  website: String,
  lastUpdated: Date,
  effectiveDate: Date,
  expiryDate: Date,
  
  // Custom framework properties
  isCustom: {
    type: Boolean,
    default: false
  },
  createdBy: String,
  organizationId: String,
  
  // Tags and categorization
  tags: [String],
  industry: [String],
  region: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('ComplianceFramework', ComplianceFrameworkSchema);
