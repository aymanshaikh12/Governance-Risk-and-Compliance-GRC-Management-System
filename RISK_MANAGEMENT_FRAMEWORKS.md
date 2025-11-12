# ISO 27005 & NIST RMF Framework Files

## 🛡️ **Risk Management Frameworks Available**

I've created comprehensive framework files for the two main risk management standards you requested:

### **1. ISO 27005 Framework** 📋
- **File**: `iso27005-framework.json`
- **Standard**: ISO/IEC 27005:2018
- **Focus**: Information Security Risk Management
- **Controls**: 15 comprehensive controls
- **Categories**: Governance, Organization, Asset Management, Access Control, Cryptography, Physical Security, Operations, Network Security

### **2. NIST RMF Framework** 🔒
- **File**: `nist-rmf-framework.json`
- **Standard**: NIST SP 800-37 Rev 2
- **Focus**: Risk Management Framework for Information Systems
- **Controls**: 15 detailed access control controls
- **Categories**: Access Control, Account Management, Session Management, Remote Access

---

## 📊 **Framework Details**

### **ISO 27005 Framework Features:**
- **15 Controls** covering all aspects of information security risk management
- **Risk-based approach** with weighted scoring
- **Comprehensive coverage** from governance to operations
- **Global standard** applicable to all industries
- **Detailed implementation guidance** for each control

### **NIST RMF Framework Features:**
- **15 Access Control Controls** (AC-1 to AC-15)
- **Government-grade security** standards
- **Detailed control implementation** guidance
- **Comprehensive testing procedures** for each control
- **Evidence collection** requirements

---

## 🚀 **How to Use These Frameworks**

### **Step 1: Download the Framework**
1. Go to `http://localhost:3000`
2. Click **"Compliance Frameworks"**
3. Click **"Upload Framework"**
4. Download either:
   - **ISO 27005 Framework (JSON) - Risk Management**
   - **NIST RMF Framework (JSON) - Risk Management**

### **Step 2: Upload the Framework**
1. Select the downloaded file
2. Choose framework type (Cybersecurity)
3. Click **"Upload Framework"**
4. Verify success message

### **Step 3: View Framework Details**
1. The framework will appear in your frameworks list
2. Click on the framework name to view details
3. Explore all controls and their requirements
4. Review implementation guidance and testing procedures

---

## 📋 **Control Categories**

### **ISO 27005 Controls:**
1. **A.5.1.1** - Information Security Policies
2. **A.5.1.2** - Review of Information Security Policies
3. **A.6.1.1** - Information Security Roles and Responsibilities
4. **A.6.1.2** - Segregation of Duties
5. **A.8.1.1** - Inventory of Assets
6. **A.8.1.2** - Ownership of Assets
7. **A.8.1.3** - Acceptable Use of Assets
8. **A.8.1.4** - Return of Assets
9. **A.9.1.1** - Access Control Policy
10. **A.9.1.2** - Access to Networks and Network Services
11. **A.10.1.1** - Cryptographic Controls
12. **A.10.1.2** - Key Management
13. **A.11.1.1** - Physical and Environmental Security
14. **A.12.1.1** - Documented Operating Procedures
15. **A.13.1.1** - Network Security Management

### **NIST RMF Controls:**
1. **AC-1** - Access Control Policy and Procedures
2. **AC-2** - Account Management
3. **AC-3** - Access Enforcement
4. **AC-4** - Information Flow Enforcement
5. **AC-5** - Separation of Duties
6. **AC-6** - Least Privilege
7. **AC-7** - Unsuccessful Logon Attempts
8. **AC-8** - System Use Notification
9. **AC-9** - Previous Logon Notification
10. **AC-10** - Concurrent Session Control
11. **AC-11** - Session Lock
12. **AC-12** - Session Termination
13. **AC-13** - Supervision and Review
14. **AC-14** - Permitted Actions Without Identification or Authentication
15. **AC-15** - Remote Access

---

## 🎯 **Assessment Criteria**

### **ISO 27005 Assessment:**
- **Frequency**: Annually
- **Methodology**: ISO 27005 risk-based assessment
- **Scoring**: Weighted Score
- **Thresholds**: Pass (80%), Warning (60%), Fail (40%)

### **NIST RMF Assessment:**
- **Frequency**: Annually
- **Methodology**: NIST RMF assessment methodology
- **Scoring**: Control Implementation Score
- **Thresholds**: Pass (85%), Warning (70%), Fail (50%)

---

## 🔧 **Implementation Guidance**

### **For ISO 27005:**
- Focus on **risk-based approach**
- Implement **comprehensive governance**
- Ensure **regular policy reviews**
- Maintain **asset management**
- Implement **access controls**

### **For NIST RMF:**
- Focus on **access control implementation**
- Implement **account management**
- Ensure **session security**
- Maintain **supervision and review**
- Implement **remote access controls**

---

## 📈 **Risk Management Benefits**

### **ISO 27005 Benefits:**
- ✅ **Comprehensive risk coverage**
- ✅ **International standard compliance**
- ✅ **Structured risk management process**
- ✅ **Regular assessment and review**
- ✅ **Integration with other ISO standards**

### **NIST RMF Benefits:**
- ✅ **Government-grade security**
- ✅ **Detailed control implementation**
- ✅ **Comprehensive testing procedures**
- ✅ **Evidence collection requirements**
- ✅ **Integration with NIST Cybersecurity Framework**

---

## 🚀 **Quick Start Guide**

### **1. Upload ISO 27005:**
```bash
# Download and upload ISO 27005 framework
curl -X POST http://localhost:3000/api/frameworks/upload \
  -H "Content-Type: application/json" \
  -d @public/data/iso27005-framework.json
```

### **2. Upload NIST RMF:**
```bash
# Download and upload NIST RMF framework
curl -X POST http://localhost:3000/api/frameworks/upload \
  -H "Content-Type: application/json" \
  -d @public/data/nist-rmf-framework.json
```

### **3. View Frameworks:**
- Go to `http://localhost:3000`
- Click **"Compliance Frameworks"**
- View your uploaded frameworks
- Click on any framework to see detailed information

---

## 📚 **Additional Resources**

### **ISO 27005 Resources:**
- [ISO 27005 Official Page](https://www.iso.org/standard/27005)
- [ISO 27005 Implementation Guide](https://www.iso.org/standard/27005)
- [Risk Management Best Practices](https://www.iso.org/standard/27005)

### **NIST RMF Resources:**
- [NIST SP 800-37 Rev 2](https://csrc.nist.gov/publications/detail/sp/800-37/rev-2/final)
- [NIST RMF Implementation Guide](https://csrc.nist.gov/publications/detail/sp/800-37/rev-2/final)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## ✅ **Success Criteria**

### **Framework Upload Successful When:**
1. ✅ Success message appears
2. ✅ Framework appears in frameworks list
3. ✅ All controls are visible and detailed
4. ✅ Implementation guidance is available
5. ✅ Testing procedures are documented

### **Ready for Risk Management When:**
1. ✅ Both frameworks are uploaded
2. ✅ Framework details are accessible
3. ✅ Controls are properly categorized
4. ✅ Assessment criteria are defined
5. ✅ Implementation guidance is available

---

**🎉 Your CompSec system now has comprehensive ISO 27005 and NIST RMF frameworks ready for risk management!**

**Next Steps:**
1. Upload both frameworks
2. Review control details
3. Plan implementation
4. Begin risk assessments
5. Implement controls based on guidance
