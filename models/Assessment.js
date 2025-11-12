const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  assessmentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  
  // Framework and scope
  framework: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceFramework',
    required: true
  },
  scope: {
    businessUnits: [String],
    systems: [String],
    processes: [String],
    assets: [String]
  },
  
  // Assessment details
  type: {
    type: String,
    enum: ['Self-Assessment', 'Internal Audit', 'External Audit', 'Continuous Monitoring', 'Risk Assessment'],
    required: true
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed', 'Cancelled', 'On Hold'],
    default: 'Planned'
  },
  
  // Timeline
  plannedStartDate: {
    type: Date,
    required: true
  },
  plannedEndDate: {
    type: Date,
    required: true
  },
  actualStartDate: Date,
  actualEndDate: Date,
  
  // Assessment team
  assessor: {
    type: String,
    required: true
  },
  team: [{
    name: String,
    role: String,
    email: String
  }],
  
  // Results
  results: [{
    controlId: String,
    controlTitle: String,
    status: {
      type: String,
      enum: ['Compliant', 'Non-Compliant', 'Partially Compliant', 'Not Applicable', 'Not Assessed']
    },
    score: Number,
    maxScore: Number,
    evidence: [{
      type: String,
      description: String,
      url: String,
      uploadedAt: Date
    }],
    findings: [{
      type: String,
      enum: ['Observation', 'Minor Non-Conformity', 'Major Non-Conformity', 'Critical Non-Conformity'],
      description: String,
      recommendation: String,
      priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical']
      }
    }],
    notes: String,
    assessedBy: String,
    assessedDate: Date
  }],
  
  // Overall assessment results
  overallScore: Number,
  maxPossibleScore: Number,
  compliancePercentage: Number,
  riskLevel: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High', 'Critical']
  },
  
  // Recommendations and action items
  recommendations: [{
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    assignedTo: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Completed', 'Cancelled']
    },
    createdDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Reports and documentation
  reports: [{
    type: String,
    title: String,
    url: String,
    generatedAt: Date,
    generatedBy: String
  }],
  
  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpAssessor: String,
  
  // Metadata
  createdBy: String,
  lastModifiedBy: String,
  tags: [String],
  notes: String
}, {
  timestamps: true
});

// Calculate overall score and compliance percentage
AssessmentSchema.pre('save', function(next) {
  if (this.results && this.results.length > 0) {
    const totalScore = this.results.reduce((sum, result) => sum + (result.score || 0), 0);
    const maxScore = this.results.reduce((sum, result) => sum + (result.maxScore || 0), 0);
    
    this.overallScore = totalScore;
    this.maxPossibleScore = maxScore;
    this.compliancePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    
    // Determine risk level based on compliance percentage
    if (this.compliancePercentage >= 95) {
      this.riskLevel = 'Very Low';
    } else if (this.compliancePercentage >= 85) {
      this.riskLevel = 'Low';
    } else if (this.compliancePercentage >= 70) {
      this.riskLevel = 'Medium';
    } else if (this.compliancePercentage >= 50) {
      this.riskLevel = 'High';
    } else if (this.compliancePercentage >= 25) {
      this.riskLevel = 'Very High';
    } else {
      this.riskLevel = 'Critical';
    }
  }
  
  next();
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
