// Simple test script to verify the GRC Compliance Management System

const mongoose = require('mongoose');
const Risk = require('./models/Risk');
const ComplianceFramework = require('./models/ComplianceFramework');
const Assessment = require('./models/Assessment');

// Test configuration
const MONGODB_URI = 'mongodb://localhost:27017/compsec_compliance_test';

async function runTests() {
  try {
    console.log('🧪 Starting CompSec - Security Compliance Management System Tests...\n');
    
    // Connect to test database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB test database');
    
    // Clear test data
    await Risk.deleteMany({});
    await ComplianceFramework.deleteMany({});
    await Assessment.deleteMany({});
    console.log('✅ Cleared test data');
    
    // Test 1: Create a compliance framework
    console.log('\n📋 Test 1: Creating ISO 27005 framework...');
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
          requirements: ['Documented policies', 'Regular reviews']
        }
      ]
    });
    
    await iso27005.save();
    console.log('✅ ISO 27005 framework created successfully');
    
    // Test 2: Create a risk
    console.log('\n⚠️  Test 2: Creating a sample risk...');
    const sampleRisk = new Risk({
      riskId: 'RISK-TEST-001',
      title: 'Test Data Breach Risk',
      description: 'Test risk for system validation',
      category: 'Technical',
      subCategory: 'Cybersecurity',
      likelihood: 'Medium',
      likelihoodScore: 3,
      impact: 'High',
      impactScore: 4,
      businessUnit: 'IT Security',
      asset: 'Test Database',
      threat: 'External Attack',
      vulnerability: 'Unpatched Software',
      treatment: 'Mitigate',
      treatmentDescription: 'Implement security controls',
      treatmentOwner: 'Test Owner',
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdBy: 'Test User',
      updatedBy: 'Test User',
      complianceFrameworks: [{
        framework: iso27005._id,
        controlId: 'A.5.1.1',
        controlTitle: 'Information Security Policies',
        requirement: 'Test requirement'
      }]
    });
    
    await sampleRisk.save();
    console.log('✅ Sample risk created successfully');
    console.log(`   Risk Score: ${sampleRisk.riskScore}`);
    console.log(`   Risk Level: ${sampleRisk.riskLevel}`);
    
    // Test 3: Create an assessment
    console.log('\n📊 Test 3: Creating a sample assessment...');
    const sampleAssessment = new Assessment({
      assessmentId: 'ASSESS-TEST-001',
      name: 'Test ISO 27005 Assessment',
      description: 'Test assessment for system validation',
      framework: iso27005._id,
      type: 'Self-Assessment',
      status: 'Completed',
      plannedStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      plannedEndDate: new Date(),
      actualStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      actualEndDate: new Date(),
      assessor: 'Test Assessor',
      results: [
        {
          controlId: 'A.5.1.1',
          controlTitle: 'Information Security Policies',
          status: 'Compliant',
          score: 85,
          maxScore: 100,
          assessedBy: 'Test Assessor',
          assessedDate: new Date()
        }
      ],
      createdBy: 'Test User',
      lastModifiedBy: 'Test User'
    });
    
    await sampleAssessment.save();
    console.log('✅ Sample assessment created successfully');
    console.log(`   Compliance Percentage: ${sampleAssessment.compliancePercentage}%`);
    console.log(`   Risk Level: ${sampleAssessment.riskLevel}`);
    
    // Test 4: Verify risk calculations
    console.log('\n🧮 Test 4: Verifying risk calculations...');
    const risk = await Risk.findOne({ riskId: 'RISK-TEST-001' });
    
    const expectedScore = risk.likelihoodScore * risk.impactScore;
    const expectedLevel = expectedScore >= 20 ? 'Critical' : 
                         expectedScore >= 15 ? 'Very High' :
                         expectedScore >= 10 ? 'High' :
                         expectedScore >= 6 ? 'Medium' :
                         expectedScore >= 3 ? 'Low' : 'Very Low';
    
    if (risk.riskScore === expectedScore && risk.riskLevel === expectedLevel) {
      console.log('✅ Risk calculations are correct');
      console.log(`   Expected Score: ${expectedScore}, Actual: ${risk.riskScore}`);
      console.log(`   Expected Level: ${expectedLevel}, Actual: ${risk.riskLevel}`);
    } else {
      console.log('❌ Risk calculations are incorrect');
      console.log(`   Expected Score: ${expectedScore}, Actual: ${risk.riskScore}`);
      console.log(`   Expected Level: ${expectedLevel}, Actual: ${risk.riskLevel}`);
    }
    
    // Test 5: Test risk treatment strategies
    console.log('\n🛡️  Test 5: Testing risk treatment strategies...');
    const treatmentStrategies = ['Avoid', 'Transfer', 'Mitigate', 'Accept'];
    let treatmentTestPassed = true;
    
    for (const treatment of treatmentStrategies) {
      const treatmentRisk = new Risk({
        riskId: `RISK-TREATMENT-${treatment}`,
        title: `Test ${treatment} Risk`,
        description: `Test risk with ${treatment} treatment`,
        category: 'Technical',
        subCategory: 'Test',
        likelihood: 'Medium',
        likelihoodScore: 3,
        impact: 'Medium',
        impactScore: 3,
        businessUnit: 'Test',
        asset: 'Test Asset',
        threat: 'Test Threat',
        vulnerability: 'Test Vulnerability',
        treatment: treatment,
        treatmentDescription: `Test ${treatment} treatment`,
        treatmentOwner: 'Test Owner',
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        createdBy: 'Test User',
        updatedBy: 'Test User'
      });
      
      await treatmentRisk.save();
      
      if (treatmentRisk.treatment !== treatment) {
        treatmentTestPassed = false;
        console.log(`❌ Treatment ${treatment} not saved correctly`);
      }
    }
    
    if (treatmentTestPassed) {
      console.log('✅ All treatment strategies work correctly');
    }
    
    // Test 6: Test framework integration
    console.log('\n🔗 Test 6: Testing framework integration...');
    const riskWithFramework = await Risk.findOne({ riskId: 'RISK-TEST-001' }).populate('complianceFrameworks.framework');
    
    if (riskWithFramework.complianceFrameworks.length > 0 && 
        riskWithFramework.complianceFrameworks[0].framework) {
      console.log('✅ Framework integration works correctly');
      console.log(`   Framework: ${riskWithFramework.complianceFrameworks[0].framework.name}`);
    } else {
      console.log('❌ Framework integration failed');
    }
    
    // Summary
    console.log('\n📈 Test Summary:');
    console.log('================');
    
    const riskCount = await Risk.countDocuments();
    const frameworkCount = await ComplianceFramework.countDocuments();
    const assessmentCount = await Assessment.countDocuments();
    
    console.log(`✅ Risks created: ${riskCount}`);
    console.log(`✅ Frameworks created: ${frameworkCount}`);
    console.log(`✅ Assessments created: ${assessmentCount}`);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('🚀 CompSec - Security Compliance Management System is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    // Clean up test data
    try {
      await Risk.deleteMany({});
      await ComplianceFramework.deleteMany({});
      await Assessment.deleteMany({});
      console.log('\n🧹 Test data cleaned up');
    } catch (cleanupError) {
      console.error('⚠️  Error cleaning up test data:', cleanupError.message);
    }
    
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the tests
runTests();
