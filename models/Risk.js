const mongoose = require('mongoose');

const RiskSchema = new mongoose.Schema({
  // Basic Risk Information
  riskId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Operational', 'Strategic', 'Financial', 'Compliance', 'Reputational'],
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  
  // Risk Assessment (ISO 27005/NIST RMF)
  likelihood: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
    required: true
  },
  likelihoodScore: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  impact: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
    required: true
  },
  impactScore: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High', 'Critical']
  },
  riskScore: {
    type: Number
  },
  
  // Risk Treatment (ISO 27005)
  treatment: {
    type: String,
    enum: ['Avoid', 'Transfer', 'Mitigate', 'Accept'],
    required: true
  },
  treatmentDescription: {
    type: String,
    required: true
  },
  treatmentStatus: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Planned'
  },
  treatmentOwner: {
    type: String,
    required: true
  },
  treatmentDueDate: {
    type: Date
  },
  treatmentCost: {
    type: Number,
    min: 0
  },
  
  // Residual Risk Assessment
  residualLikelihood: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High']
  },
  residualLikelihoodScore: {
    type: Number,
    min: 1,
    max: 5
  },
  residualImpact: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High']
  },
  residualImpactScore: {
    type: Number,
    min: 1,
    max: 5
  },
  residualRiskLevel: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High', 'Critical']
  },
  residualRiskScore: {
    type: Number
  },
  
  // Compliance Framework Mapping
  complianceFrameworks: [{
    framework: {
      type: String,
      enum: ['ISO 27005', 'NIST RMF', 'ISO 27001', 'SOC 2', 'PCI DSS', 'GDPR', 'HIPAA', 'SOX', 'COBIT', 'Custom']
    },
    controlId: String,
    controlTitle: String,
    requirement: String
  }],
  
  // Risk Context
  businessUnit: {
    type: String,
    required: true
  },
  asset: {
    type: String,
    required: true
  },
  threat: {
    type: String,
    required: true
  },
  vulnerability: {
    type: String,
    required: true
  },
  
  // Risk History and Monitoring
  identifiedDate: {
    type: Date,
    default: Date.now
  },
  lastReviewDate: {
    type: Date,
    default: Date.now
  },
  nextReviewDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Closed', 'Under Review'],
    default: 'Active'
  },
  
  // Additional Information
  tags: [String],
  notes: String,
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Calculate risk score based on likelihood and impact
RiskSchema.pre('save', function(next) {
  this.riskScore = this.likelihoodScore * this.impactScore;
  
  // Determine risk level based on score
  if (this.riskScore >= 20) {
    this.riskLevel = 'Critical';
  } else if (this.riskScore >= 15) {
    this.riskLevel = 'Very High';
  } else if (this.riskScore >= 10) {
    this.riskLevel = 'High';
  } else if (this.riskScore >= 6) {
    this.riskLevel = 'Medium';
  } else if (this.riskScore >= 3) {
    this.riskLevel = 'Low';
  } else {
    this.riskLevel = 'Very Low';
  }
  
  // Calculate residual risk score if treatment is applied
  if (this.residualLikelihoodScore && this.residualImpactScore) {
    this.residualRiskScore = this.residualLikelihoodScore * this.residualImpactScore;
    
    if (this.residualRiskScore >= 20) {
      this.residualRiskLevel = 'Critical';
    } else if (this.residualRiskScore >= 15) {
      this.residualRiskLevel = 'Very High';
    } else if (this.residualRiskScore >= 10) {
      this.residualRiskLevel = 'High';
    } else if (this.residualRiskScore >= 6) {
      this.residualRiskLevel = 'Medium';
    } else if (this.residualRiskScore >= 3) {
      this.residualRiskLevel = 'Low';
    } else {
      this.residualRiskLevel = 'Very Low';
    }
  }
  
  next();
});

module.exports = mongoose.model('Risk', RiskSchema);
