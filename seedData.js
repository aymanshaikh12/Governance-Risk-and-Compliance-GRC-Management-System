const mongoose = require('mongoose');
const Risk = require('./models/Risk');
const ComplianceFramework = require('./models/ComplianceFramework');
const Assessment = require('./models/Assessment');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/compsec_compliance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedData() {
  try {
    console.log('Starting data seeding...');
    
    // Clear existing data
    await Risk.deleteMany({});
    await ComplianceFramework.deleteMany({});
    await Assessment.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create compliance frameworks
    const iso27005 = new ComplianceFramework({
      name: 'ISO 27005',
      version: '2018',
      description: 'Information security risk management standard providing guidelines for risk management in the context of information security',
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
        },
        {
          controlId: 'A.8.1.1',
          title: 'Inventory of Assets',
          description: 'Assets associated with information and information processing facilities shall be identified',
          category: 'Asset Management',
          priority: 'Medium',
          requirements: [
            'Asset inventory maintenance',
            'Asset ownership assignment',
            'Asset classification'
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
        },
        {
          controlId: 'SC-7',
          title: 'Boundary Protection',
          description: 'Monitor and control communications at the external boundary',
          category: 'System and Communications Protection',
          priority: 'High',
          requirements: [
            'Network boundary controls',
            'Traffic monitoring',
            'Intrusion detection'
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
    console.log('Created compliance frameworks');
    
    // Create sample risks
    const sampleRisks = [
      {
        riskId: 'RISK-0001',
        title: 'Data Breach from External Attack',
        description: 'Unauthorized access to sensitive customer data through external cyber attacks',
        category: 'Technical',
        subCategory: 'Cybersecurity',
        likelihood: 'Medium',
        likelihoodScore: 3,
        impact: 'High',
        impactScore: 4,
        businessUnit: 'IT Security',
        asset: 'Customer Database',
        threat: 'External Hackers',
        vulnerability: 'Unpatched Software',
        treatment: 'Mitigate',
        treatmentDescription: 'Implement multi-factor authentication, regular security patches, and network monitoring',
        treatmentOwner: 'CISO',
        treatmentStatus: 'In Progress',
        treatmentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        treatmentCost: 50000,
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        createdBy: 'Risk Manager',
        updatedBy: 'Risk Manager',
        complianceFrameworks: [
          {
            framework: 'ISO 27005',
            controlId: 'A.8.1.1',
            controlTitle: 'Inventory of Assets',
            requirement: 'Asset protection and access control'
          },
          {
            framework: 'NIST RMF',
            controlId: 'AC-2',
            controlTitle: 'Account Management',
            requirement: 'Secure account management practices'
          }
        ]
      },
      {
        riskId: 'RISK-0002',
        title: 'Insider Threat - Data Theft',
        description: 'Malicious insider stealing sensitive company data for personal gain',
        category: 'Operational',
        subCategory: 'Human Resources',
        likelihood: 'Low',
        likelihoodScore: 2,
        impact: 'High',
        impactScore: 4,
        businessUnit: 'Human Resources',
        asset: 'Employee Data',
        threat: 'Malicious Insider',
        vulnerability: 'Insufficient Access Controls',
        treatment: 'Mitigate',
        treatmentDescription: 'Implement role-based access controls, regular access reviews, and employee monitoring',
        treatmentOwner: 'HR Director',
        treatmentStatus: 'Planned',
        treatmentDueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        treatmentCost: 25000,
        nextReviewDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        createdBy: 'Risk Manager',
        updatedBy: 'Risk Manager',
        complianceFrameworks: [
          {
            framework: 'ISO 27005',
            controlId: 'A.6.1.1',
            controlTitle: 'Information Security Roles and Responsibilities',
            requirement: 'Clear role definitions and access controls'
          }
        ]
      },
      {
        riskId: 'RISK-0003',
        title: 'Regulatory Non-Compliance',
        description: 'Failure to comply with GDPR data protection requirements',
        category: 'Compliance',
        subCategory: 'Data Protection',
        likelihood: 'Medium',
        likelihoodScore: 3,
        impact: 'High',
        impactScore: 4,
        businessUnit: 'Legal & Compliance',
        asset: 'Personal Data',
        threat: 'Regulatory Investigation',
        vulnerability: 'Insufficient Data Protection Measures',
        treatment: 'Mitigate',
        treatmentDescription: 'Implement GDPR compliance program, data mapping, and privacy impact assessments',
        treatmentOwner: 'Data Protection Officer',
        treatmentStatus: 'In Progress',
        treatmentDueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        treatmentCost: 100000,
        nextReviewDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        createdBy: 'Risk Manager',
        updatedBy: 'Risk Manager',
        complianceFrameworks: [
          {
            framework: 'GDPR',
            controlId: 'Art. 5',
            controlTitle: 'Principles relating to processing of personal data',
            requirement: 'Lawful and transparent data processing'
          }
        ]
      },
      {
        riskId: 'RISK-0004',
        title: 'System Downtime',
        description: 'Critical business systems unavailable due to hardware failure',
        category: 'Technical',
        subCategory: 'Infrastructure',
        likelihood: 'Low',
        likelihoodScore: 2,
        impact: 'Medium',
        impactScore: 3,
        businessUnit: 'IT Operations',
        asset: 'Production Servers',
        threat: 'Hardware Failure',
        vulnerability: 'Aging Infrastructure',
        treatment: 'Transfer',
        treatmentDescription: 'Purchase comprehensive hardware maintenance contract and business continuity insurance',
        treatmentOwner: 'IT Director',
        treatmentStatus: 'Completed',
        treatmentDueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        treatmentCost: 15000,
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        createdBy: 'Risk Manager',
        updatedBy: 'Risk Manager'
      },
      {
        riskId: 'RISK-0005',
        title: 'Reputation Damage',
        description: 'Negative publicity affecting company reputation and customer trust',
        category: 'Reputational',
        subCategory: 'Public Relations',
        likelihood: 'Low',
        likelihoodScore: 2,
        impact: 'High',
        impactScore: 4,
        businessUnit: 'Marketing',
        asset: 'Brand Reputation',
        threat: 'Negative Media Coverage',
        vulnerability: 'Insufficient Crisis Management',
        treatment: 'Accept',
        treatmentDescription: 'Accept residual risk with enhanced monitoring and rapid response procedures',
        treatmentOwner: 'Marketing Director',
        treatmentStatus: 'Completed',
        treatmentDueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        treatmentCost: 0,
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        createdBy: 'Risk Manager',
        updatedBy: 'Risk Manager'
      }
    ];
    
    for (const riskData of sampleRisks) {
      const risk = new Risk(riskData);
      await risk.save();
    }
    console.log('Created sample risks');
    
    // Create sample assessments
    const sampleAssessments = [
      {
        assessmentId: 'ASSESS-0001',
        name: 'ISO 27005 Risk Assessment 2024',
        description: 'Annual risk assessment following ISO 27005 guidelines',
        framework: iso27005._id,
        scope: {
          businessUnits: ['IT Security', 'IT Operations', 'Human Resources'],
          systems: ['Customer Database', 'Employee Database', 'Production Servers'],
          processes: ['Data Processing', 'Access Management', 'Incident Response']
        },
        type: 'Self-Assessment',
        status: 'Completed',
        plannedStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        plannedEndDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        actualStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        actualEndDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        assessor: 'Internal Audit Team',
        team: [
          { name: 'John Smith', role: 'Lead Assessor', email: 'john.smith@company.com' },
          { name: 'Jane Doe', role: 'Risk Analyst', email: 'jane.doe@company.com' }
        ],
        results: [
          {
            controlId: 'A.5.1.1',
            controlTitle: 'Information Security Policies',
            status: 'Compliant',
            score: 85,
            maxScore: 100,
            evidence: [
              { type: 'Document', description: 'Information Security Policy v2.1', url: '/documents/isp-v2.1.pdf' }
            ],
            findings: [],
            notes: 'Policy is comprehensive and up to date',
            assessedBy: 'John Smith',
            assessedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
          },
          {
            controlId: 'A.6.1.1',
            controlTitle: 'Information Security Roles and Responsibilities',
            status: 'Partially Compliant',
            score: 70,
            maxScore: 100,
            evidence: [
              { type: 'Document', description: 'Role Definition Matrix', url: '/documents/roles-matrix.xlsx' }
            ],
            findings: [
              {
                type: 'Minor Non-Conformity',
                description: 'Some roles lack clear responsibility definitions',
                recommendation: 'Update role descriptions to include specific security responsibilities',
                priority: 'Medium'
              }
            ],
            notes: 'Most roles are well defined, minor improvements needed',
            assessedBy: 'Jane Doe',
            assessedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
          }
        ],
        recommendations: [
          {
            title: 'Update Role Descriptions',
            description: 'Ensure all security roles have clear responsibility definitions',
            priority: 'Medium',
            assignedTo: 'HR Director',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'Open'
          }
        ],
        createdBy: 'Internal Audit Team',
        lastModifiedBy: 'Internal Audit Team'
      },
      {
        assessmentId: 'ASSESS-0002',
        name: 'NIST RMF Security Assessment',
        description: 'Quarterly security assessment following NIST RMF guidelines',
        framework: nistRMF._id,
        scope: {
          businessUnits: ['IT Security'],
          systems: ['Customer Database', 'Production Servers'],
          processes: ['Access Management', 'Network Security']
        },
        type: 'Internal Audit',
        status: 'In Progress',
        plannedStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        plannedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        actualStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        assessor: 'Security Team',
        team: [
          { name: 'Mike Johnson', role: 'Security Analyst', email: 'mike.johnson@company.com' }
        ],
        results: [
          {
            controlId: 'AC-1',
            controlTitle: 'Access Control Policy and Procedures',
            status: 'Compliant',
            score: 90,
            maxScore: 100,
            evidence: [
              { type: 'Document', description: 'Access Control Policy', url: '/documents/access-control-policy.pdf' }
            ],
            findings: [],
            notes: 'Policy is well documented and implemented',
            assessedBy: 'Mike Johnson',
            assessedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          }
        ],
        createdBy: 'Security Team',
        lastModifiedBy: 'Security Team'
      }
    ];
    
    for (const assessmentData of sampleAssessments) {
      const assessment = new Assessment(assessmentData);
      await assessment.save();
    }
    console.log('Created sample assessments');
    
    console.log('Data seeding completed successfully!');
    console.log(`Created ${sampleRisks.length} risks, ${sampleAssessments.length} assessments, and 3 frameworks`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeder
seedData();
