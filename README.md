# CompSec - Security Compliance Management System

A comprehensive Security Compliance Management System with a focus on Risk Assessment and Mitigation Plan using ISO 27005/NIST RMF guidelines. CompSec provides flexibility to integrate and manage various compliance frameworks for enterprise security governance.

## Features

### 🛡️ Risk Management (ISO 27005/NIST RMF)
- **Comprehensive Risk Register**: Track and manage risks with detailed information
- **Risk Assessment**: Calculate risk scores based on likelihood and impact (1-5 scale)
- **Risk Treatment**: Implement four treatment strategies:
  - **Avoid**: Eliminate the risk entirely
  - **Transfer**: Transfer risk to third party (insurance, outsourcing)
  - **Mitigate**: Reduce likelihood or impact through controls
  - **Accept**: Accept residual risk with monitoring
- **Residual Risk Assessment**: Evaluate risk after treatment implementation
- **Risk Monitoring**: Track risk status, review dates, and treatment progress

### 📋 Compliance Framework Integration
- **Multi-Framework Support**: Built-in support for:
  - ISO 27005 (Information Security Risk Management)
  - NIST RMF (Risk Management Framework)
  - GDPR (General Data Protection Regulation)
  - ISO 27001, SOC 2, PCI DSS, HIPAA, SOX, COBIT
  - Custom frameworks
- **Framework Management**: Add, edit, and manage compliance frameworks
- **Control Mapping**: Map risks to specific framework controls
- **Requirement Tracking**: Track compliance requirements and evidence

### 📊 Assessment Management
- **Multiple Assessment Types**:
  - Self-Assessment
  - Internal Audit
  - External Audit
  - Continuous Monitoring
  - Risk Assessment
- **Compliance Scoring**: Calculate compliance percentages and risk levels
- **Evidence Management**: Attach and track compliance evidence
- **Recommendations**: Generate and track improvement recommendations

### 📈 Dashboard & Reporting
- **Executive Dashboard**: High-level view of compliance and risk status
- **Risk Distribution Charts**: Visual representation of risk levels
- **Compliance Trends**: Track compliance improvements over time
- **Compliance Reports**: Generate comprehensive compliance reports
- **Gap Analysis**: Identify compliance gaps and non-conformities


## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Charts**: Chart.js
- **Database**: MongoDB with Mongoose ODM

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GRC_ENDSEM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Seed sample data (optional)**
   ```bash
   node seedData.js
   ```

6. **Start the application**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Usage

### Getting Started

1. **Initialize Sample Data**: Click "Initialize Data" in the navigation to load sample frameworks and data
2. **Dashboard**: View overall compliance and risk status
3. **Risk Management**: Add, view, and manage risks
4. **Assessments**: Create and track compliance assessments
5. **Frameworks**: Manage compliance frameworks and controls
6. **Reports**: Generate compliance and risk reports

### Risk Management Workflow

1. **Identify Risk**: Add new risks with detailed information
2. **Assess Risk**: Evaluate likelihood and impact (1-5 scale)
3. **Calculate Risk Score**: System automatically calculates risk score (likelihood × impact)
4. **Determine Risk Level**: 
   - Critical (20-25)
   - Very High (15-19)
   - High (10-14)
   - Medium (6-9)
   - Low (3-5)
   - Very Low (1-2)
5. **Select Treatment**: Choose appropriate treatment strategy
6. **Implement Controls**: Track treatment implementation
7. **Assess Residual Risk**: Evaluate remaining risk after treatment
8. **Monitor and Review**: Regular risk reviews and updates

### Compliance Assessment Workflow

1. **Create Assessment**: Define assessment scope and framework
2. **Select Controls**: Choose controls to assess
3. **Evaluate Compliance**: Assess each control against requirements
4. **Document Evidence**: Attach supporting documentation
5. **Record Findings**: Document non-conformities and observations
6. **Generate Recommendations**: Create improvement actions
7. **Track Progress**: Monitor recommendation implementation



### Risk Model
- Basic risk information (ID, title, description, category)
- Risk assessment (likelihood, impact, risk level, risk score)
- Risk treatment (strategy, description, owner, status, cost)
- Residual risk assessment
- Compliance framework mapping
- Risk context (business unit, asset, threat, vulnerability)
- Audit trail and metadata

### Compliance Framework Model
- Framework information (name, version, description, type)
- Controls and requirements
- Assessment criteria
- Integration settings
- Custom properties

### Assessment Model
- Assessment details (ID, name, description, type, status)
- Framework and scope
- Assessment team
- Results and scoring
- Recommendations and action items
- Reports and documentation

## Customization

### Adding New Compliance Frameworks

1. **Create Framework**: Use the framework management interface
2. **Define Controls**: Add specific controls and requirements
3. **Set Assessment Criteria**: Configure scoring and thresholds
4. **Map to Risks**: Link risks to framework controls

### Custom Risk Categories

The system supports custom risk categories:
- Technical
- Operational
- Strategic
- Financial
- Compliance
- Reputational

### Risk Treatment Strategies

Four standard treatment strategies are supported:
- **Avoid**: Complete elimination of risk
- **Transfer**: Risk transfer to third party
- **Mitigate**: Risk reduction through controls
- **Accept**: Accept residual risk with monitoring

## Security Considerations

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure authentication (to be implemented)
- Data encryption at rest and in transit
- Audit logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation



## Acknowledgments

- ISO 27005:2018 - Information security risk management
- NIST SP 800-37 - Risk Management Framework
- OWASP Risk Rating Methodology
- Industry best practices for GRC systems
