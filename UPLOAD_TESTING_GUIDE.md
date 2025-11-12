# CompSec Framework Upload Testing Guide

## 🚀 How to Test Framework Upload

### Step 1: Access the Upload Feature
1. Open CompSec at `http://localhost:3000`
2. Navigate to **"Compliance Frameworks"** section
3. Click **"Upload Framework"** button

### Step 2: Download Test Files
In the upload modal, you'll see these test files available for download:

#### **Recommended for Testing:**
1. **Simple Framework (JSON) - Easy Test** ⭐
   - **File**: `simple-framework.json`
   - **Description**: Basic security framework with 3 controls
   - **Best for**: First-time testing, simple validation

2. **OWASP ASVS Framework (JSON)**
   - **File**: `test-framework.json`
   - **Description**: OWASP Application Security Verification Standard
   - **Best for**: Testing with real-world framework

#### **Advanced Testing:**
3. **Multiple Frameworks (JSON)**
   - **File**: `sample-frameworks.json`
   - **Description**: Contains 4 different frameworks
   - **Best for**: Testing bulk upload

4. **ISO 27001 Framework (JSON)**
   - **File**: `iso27001-framework.json`
   - **Description**: Complete ISO 27001 framework
   - **Best for**: Testing with comprehensive framework

### Step 3: Upload Process
1. **Download a test file** (start with "Simple Framework")
2. **Select the downloaded file** using the file input
3. **Choose framework type** (Cybersecurity, Data Protection, etc.)
4. **Click "Upload Framework"**
5. **Verify success message** appears
6. **Check the frameworks list** to see your uploaded framework

### Step 4: Verify Upload
After successful upload:
1. The framework should appear in the frameworks list
2. Click on the framework to view details
3. Verify all controls and information are displayed correctly

---

## 🧪 Test Scenarios

### Test 1: Simple Framework Upload
**File**: `simple-framework.json`
**Expected Result**: ✅ Success
**What to Check**:
- Framework appears in list
- All 3 controls are visible
- Framework details are complete

### Test 2: OWASP Framework Upload
**File**: `test-framework.json`
**Expected Result**: ✅ Success
**What to Check**:
- Framework appears in list
- All 5 controls are visible
- OWASP-specific information is displayed

### Test 3: Multiple Frameworks Upload
**File**: `sample-frameworks.json`
**Expected Result**: ✅ Success (4 frameworks uploaded)
**What to Check**:
- All 4 frameworks appear in list
- Each framework has correct details
- Controls are properly mapped

### Test 4: Invalid File Upload
**File**: Any non-JSON file
**Expected Result**: ❌ Error message
**What to Check**:
- Error message appears
- No framework is added to list

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue: "Invalid JSON file" Error
**Cause**: File is not valid JSON
**Solution**: 
- Ensure file is properly formatted JSON
- Check for syntax errors
- Use provided test files

#### Issue: "Error uploading framework" Error
**Cause**: Server-side processing error
**Solution**:
- Check browser console for detailed error
- Verify server is running
- Check database connection

#### Issue: File not uploading
**Cause**: File input not working
**Solution**:
- Ensure file is selected
- Check file size (should be reasonable)
- Try a different browser

#### Issue: Framework appears but details are missing
**Cause**: Incomplete framework data
**Solution**:
- Check framework JSON structure
- Ensure all required fields are present
- Use provided test files as reference

---

## 📋 Framework JSON Structure

### Required Fields
```json
{
  "name": "Framework Name",
  "version": "1.0",
  "description": "Framework description",
  "type": "Cybersecurity",
  "status": "Active",
  "controls": [
    {
      "controlId": "CTRL-001",
      "title": "Control Title",
      "description": "Control description",
      "category": "Category",
      "priority": "High",
      "requirements": ["Requirement 1", "Requirement 2"],
      "implementationGuidance": "How to implement",
      "testingProcedures": ["Test 1", "Test 2"],
      "evidenceTypes": ["Evidence 1", "Evidence 2"]
    }
  ],
  "assessmentCriteria": {
    "frequency": "Annually",
    "methodology": "Assessment method",
    "scoringMethod": "Pass/Fail",
    "thresholds": {
      "pass": 100,
      "warning": 80,
      "fail": 60
    }
  }
}
```

### Optional Fields
- `publisher`: Framework publisher
- `website`: Framework website
- `tags`: Array of tags
- `industry`: Array of applicable industries
- `region`: Array of applicable regions

---

## 🎯 Success Criteria

### Upload is Successful When:
1. ✅ Success message appears
2. ✅ Framework appears in frameworks list
3. ✅ Framework details are viewable
4. ✅ All controls are displayed
5. ✅ No error messages in console

### Upload Fails When:
1. ❌ Error message appears
2. ❌ Framework doesn't appear in list
3. ❌ Console shows errors
4. ❌ File format is invalid

---

## 🚀 Quick Test Commands

### Test File Accessibility
```bash
# Test if files are accessible
curl http://localhost:3000/data/simple-framework.json
curl http://localhost:3000/data/test-framework.json
```

### Test Upload API
```bash
# Test upload API directly
curl -X POST http://localhost:3000/api/frameworks/upload \
  -H "Content-Type: application/json" \
  -d @public/data/simple-framework.json
```

---

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the server is running
3. Ensure MongoDB is connected
4. Try the provided test files
5. Check the troubleshooting section above

**Happy Testing!** 🧪✨
