# CompSec User Guide

## 🚀 Getting Started with CompSec

### What is CompSec?
CompSec is a comprehensive Security Compliance Management System designed to help organizations manage their security risks and compliance requirements. Built with ISO 27005 and NIST RMF guidelines, CompSec provides a centralized platform for risk assessment, compliance management, and framework integration.

### Key Features
- **Risk Management**: Complete risk lifecycle management with ISO 27005/NIST RMF compliance
- **Framework Integration**: Support for multiple compliance frameworks (ISO 27001, SOC 2, PCI DSS, GDPR, HIPAA, etc.)
- **Assessment Tools**: Comprehensive compliance assessment and reporting capabilities
- **Data Export/Import**: Flexible data management with JSON and CSV support
- **Real-time Dashboard**: Executive-level visibility into compliance and risk status

---

## 📋 Quick Start Guide

### 1. Initial Setup
1. **Start the Application**:
   ```bash
   cd /path/to/compsec
   npm start
   ```

2. **Access CompSec**:
   - Open your browser to `http://localhost:3000`
   - You'll see the CompSec dashboard

3. **Load Sample Data**:
   - Click "Initialize Data" in the navigation
   - This loads sample frameworks and risks for demonstration

### 2. Navigation Overview
- **Dashboard**: Overview of compliance and risk status
- **Risk Management**: Add, view, and manage risks
- **Assessments**: Create and track compliance assessments
- **Compliance Frameworks**: Manage compliance frameworks
- **Reports**: Generate compliance reports and export data

---

## 🛡️ Risk Management

### Adding a New Risk
1. Navigate to **Risk Management** section
2. Click **"Add New Risk"** button
3. Fill in the risk details:
   - **Title**: Descriptive risk title
   - **Category**: Technical, Operational, Strategic, Financial, Compliance, or Reputational
   - **Description**: Detailed risk description
   - **Likelihood**: Very Low (1) to Very High (5)
   - **Impact**: Very Low (1) to Very High (5)
   - **Business Unit**: Department responsible
   - **Asset**: Affected asset or system
   - **Threat**: Source of the risk
   - **Vulnerability**: Weakness being exploited
   - **Treatment**: Avoid, Transfer, Mitigate, or Accept
   - **Treatment Owner**: Person responsible for treatment
   - **Treatment Description**: How the risk will be addressed

4. Click **"Add Risk"** to save

### Risk Scoring
CompSec automatically calculates:
- **Risk Score**: Likelihood × Impact (1-25)
- **Risk Level**: Based on score
  - Critical: 20-25
  - Very High: 15-19
  - High: 10-14
  - Medium: 6-9
  - Low: 3-5
  - Very Low: 1-2

### Risk Treatment Strategies
- **Avoid**: Eliminate the risk entirely
- **Transfer**: Transfer to third party (insurance, outsourcing)
- **Mitigate**: Reduce likelihood or impact through controls
- **Accept**: Accept residual risk with monitoring

### Viewing Risk Details
1. Click the **eye icon** next to any risk
2. View comprehensive risk information including:
   - Basic risk information
   - Risk assessment details
   - Treatment information
   - Risk context
   - Compliance framework mappings

### Filtering Risks
Use the filter options to find specific risks:
- **Category**: Filter by risk category
- **Risk Level**: Filter by risk level
- **Treatment**: Filter by treatment strategy
- **Search**: Search by title, description, or risk ID

---

## 📊 Compliance Frameworks

### Viewing Framework Details
1. Navigate to **Compliance Frameworks** section
2. Click on any framework card or the **eye icon**
3. View comprehensive framework information including:
   - Framework details and metadata
   - Assessment criteria
   - Controls and requirements
   - Implementation guidance
   - Testing procedures

### Uploading New Frameworks
1. Click **"Upload Framework"** button
2. Select a JSON file containing framework data
3. Choose the framework type
4. Click **"Upload Framework"**

### Available Sample Frameworks
CompSec includes several pre-built frameworks:
- **ISO 27001**: Information security management systems
- **SOC 2**: Service Organization Control 2
- **PCI DSS**: Payment Card Industry Data Security Standard
- **GDPR**: General Data Protection Regulation
- **HIPAA**: Health Insurance Portability and Accountability Act
- **COBIT 2019**: Control Objectives for Information and Related Technologies
- **SOX**: Sarbanes-Oxley Act
- **NIST Cybersecurity Framework**: Framework for Improving Critical Infrastructure Cybersecurity

### Framework Controls
Each framework includes detailed controls with:
- **Control ID**: Unique identifier
- **Title**: Control name
- **Description**: What the control addresses
- **Category**: Control category
- **Priority**: Critical, High, Medium, or Low
- **Requirements**: Specific requirements to meet
- **Implementation Guidance**: How to implement
- **Testing Procedures**: How to test compliance
- **Evidence Types**: Required evidence

---

## 📈 Assessments

### Creating Assessments
1. Navigate to **Assessments** section
2. Click **"New Assessment"** button
3. Fill in assessment details:
   - **Name**: Assessment name
   - **Description**: Assessment description
   - **Framework**: Select compliance framework
   - **Type**: Self-Assessment, Internal Audit, External Audit, etc.
   - **Scope**: Define what's being assessed
   - **Team**: Assessment team members

### Assessment Types
- **Self-Assessment**: Internal compliance review
- **Internal Audit**: Formal internal audit
- **External Audit**: Third-party audit
- **Continuous Monitoring**: Ongoing compliance monitoring
- **Risk Assessment**: Focused risk evaluation

### Assessment Results
Track compliance for each control:
- **Compliant**: Meets all requirements
- **Non-Compliant**: Does not meet requirements
- **Partially Compliant**: Meets some requirements
- **Not Applicable**: Control doesn't apply
- **Not Assessed**: Not yet evaluated

---

## 📊 Dashboard

### Key Metrics
The dashboard provides high-level visibility into:
- **Critical Risks**: Number of critical risks
- **High Risks**: Number of high risks
- **Total Assessments**: Number of assessments
- **Compliance Rate**: Overall compliance percentage

### Charts and Visualizations
- **Risk Distribution**: Pie chart showing risk levels
- **Compliance Trends**: Line chart showing compliance over time
- **Recent Activities**: Latest risks and assessments
- **Upcoming Reviews**: Risks due for review

---

## 📁 Data Management

### Exporting Data
1. Navigate to **Reports** section
2. Use export options:
   - **Export All Data (JSON)**: Complete system export
   - **Export Risks (CSV)**: Risk data in CSV format
   - **Export Frameworks (CSV)**: Framework data in CSV format

### Importing Data
1. Navigate to **Reports** section
2. Click **"Choose File"** and select a JSON file
3. Click **"Import Data"** to load the data

### Sample Data
- Click **"Generate Sample Data"** to load comprehensive sample data
- Includes 15+ sample risks and multiple compliance frameworks
- Perfect for testing and demonstration purposes

---

## 🔧 Advanced Features

### Risk Mapping to Frameworks
- Link risks to specific framework controls
- Track compliance requirements for each risk
- Generate framework-specific risk reports

### Custom Frameworks
- Create custom compliance frameworks
- Define your own controls and requirements
- Set custom assessment criteria

### Bulk Operations
- Import multiple risks from CSV/JSON
- Export data in multiple formats
- Batch update risk information

### Reporting
- Generate compliance reports
- Create risk assessment reports
- Export data for external analysis

---

## 🆘 Troubleshooting

### Common Issues

**Application won't start**:
- Ensure MongoDB is running: `brew services start mongodb/brew/mongodb-community`
- Check if port 3000 is available
- Verify Node.js is installed

**Data not loading**:
- Check browser console for errors
- Verify API endpoints are responding
- Ensure database connection is working

**Upload not working**:
- Check file format (JSON required)
- Verify file size (should be reasonable)
- Check browser console for errors

### Getting Help
- Check the browser console for error messages
- Review the application logs in the terminal
- Ensure all dependencies are installed
- Verify database connectivity

---

## 📚 Best Practices

### Risk Management
1. **Regular Reviews**: Schedule regular risk reviews
2. **Clear Ownership**: Assign clear ownership for each risk
3. **Documentation**: Maintain detailed risk documentation
4. **Treatment Tracking**: Monitor treatment implementation
5. **Residual Risk**: Assess residual risk after treatment

### Compliance Management
1. **Framework Selection**: Choose appropriate frameworks
2. **Control Mapping**: Map risks to relevant controls
3. **Evidence Management**: Maintain compliance evidence
4. **Regular Assessments**: Conduct regular compliance assessments
5. **Continuous Improvement**: Use assessment results for improvement

### Data Management
1. **Regular Backups**: Export data regularly
2. **Version Control**: Keep track of data changes
3. **Access Control**: Limit access to sensitive data
4. **Audit Trail**: Maintain audit trails for changes
5. **Data Quality**: Ensure data accuracy and completeness

---

## 🎯 Getting the Most from CompSec

### Tips for Success
1. **Start Small**: Begin with a few key risks and frameworks
2. **Regular Updates**: Keep risk and compliance data current
3. **Team Training**: Train team members on system usage
4. **Integration**: Integrate with existing processes
5. **Continuous Improvement**: Use system insights for improvement

### Advanced Usage
1. **Custom Fields**: Add custom fields to risks and frameworks
2. **Automated Workflows**: Set up automated risk reviews
3. **Integration APIs**: Use APIs for system integration
4. **Custom Reports**: Create custom compliance reports
5. **Role-based Access**: Implement role-based access control

---

## 📞 Support

For additional support or questions:
- Review this user guide
- Check the application documentation
- Contact your system administrator
- Refer to the API documentation for technical details

---

**CompSec - Your comprehensive security compliance management solution!** 🛡️
