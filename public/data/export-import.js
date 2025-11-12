// CompSec Data Export/Import Utilities

// Export all data to JSON
async function exportAllData() {
    try {
        const [risks, frameworks, assessments] = await Promise.all([
            fetch('/api/risks').then(res => res.json()),
            fetch('/api/frameworks').then(res => res.json()),
            fetch('/api/assessments').then(res => res.json())
        ]);

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            data: {
                risks: risks.risks || risks,
                frameworks: frameworks,
                assessments: assessments.assessments || assessments
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `compsec-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showAlert('Data exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showAlert('Error exporting data', 'danger');
    }
}

// Import data from JSON file
async function importData(file) {
    try {
        const text = await file.text();
        const importData = JSON.parse(text);
        
        if (!importData.data) {
            throw new Error('Invalid import file format');
        }

        // Import frameworks first
        if (importData.data.frameworks) {
            for (const framework of importData.data.frameworks) {
                await fetch('/api/frameworks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(framework)
                });
            }
        }

        // Import risks
        if (importData.data.risks) {
            for (const risk of importData.data.risks) {
                await fetch('/api/risks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(risk)
                });
            }
        }

        // Import assessments
        if (importData.data.assessments) {
            for (const assessment of importData.data.assessments) {
                await fetch('/api/assessments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(assessment)
                });
            }
        }

        showAlert('Data imported successfully!', 'success');
        location.reload(); // Refresh the page to show imported data
    } catch (error) {
        console.error('Import error:', error);
        showAlert('Error importing data: ' + error.message, 'danger');
    }
}

// Export risks to CSV
async function exportRisksCSV() {
    try {
        const response = await fetch('/api/risks');
        const data = await response.json();
        const risks = data.risks || data;

        const csvHeaders = [
            'Risk ID', 'Title', 'Category', 'Likelihood', 'Impact', 'Risk Score', 'Risk Level',
            'Treatment', 'Treatment Owner', 'Business Unit', 'Asset', 'Threat', 'Vulnerability',
            'Status', 'Created Date', 'Next Review Date'
        ];

        const csvRows = risks.map(risk => [
            risk.riskId,
            `"${risk.title}"`,
            risk.category,
            risk.likelihood,
            risk.impact,
            risk.riskScore,
            risk.riskLevel,
            risk.treatment,
            `"${risk.treatmentOwner}"`,
            `"${risk.businessUnit}"`,
            `"${risk.asset}"`,
            `"${risk.threat}"`,
            `"${risk.vulnerability}"`,
            risk.status,
            new Date(risk.createdAt).toLocaleDateString(),
            new Date(risk.nextReviewDate).toLocaleDateString()
        ]);

        const csvContent = [csvHeaders, ...csvRows]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `compsec-risks-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        showAlert('Risks exported to CSV successfully!', 'success');
    } catch (error) {
        console.error('CSV export error:', error);
        showAlert('Error exporting CSV', 'danger');
    }
}

// Export frameworks to CSV
async function exportFrameworksCSV() {
    try {
        const response = await fetch('/api/frameworks');
        const frameworks = await response.json();

        const csvHeaders = [
            'Framework Name', 'Version', 'Type', 'Status', 'Publisher', 'Website',
            'Control Count', 'Assessment Frequency', 'Scoring Method'
        ];

        const csvRows = frameworks.map(framework => [
            `"${framework.name}"`,
            framework.version,
            framework.type,
            framework.status,
            `"${framework.publisher || 'N/A'}"`,
            `"${framework.website || 'N/A'}"`,
            framework.controls?.length || 0,
            framework.assessmentCriteria?.frequency || 'N/A',
            framework.assessmentCriteria?.scoringMethod || 'N/A'
        ]);

        const csvContent = [csvHeaders, ...csvRows]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `compsec-frameworks-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        showAlert('Frameworks exported to CSV successfully!', 'success');
    } catch (error) {
        console.error('CSV export error:', error);
        showAlert('Error exporting CSV', 'danger');
    }
}

// Generate sample data
async function generateSampleData() {
    try {
        // Load sample frameworks
        const frameworksResponse = await fetch('/data/sample-frameworks.json');
        const frameworksData = await frameworksResponse.json();
        
        for (const framework of frameworksData.frameworks) {
            await fetch('/api/frameworks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(framework)
            });
        }

        // Load sample risks
        const risksResponse = await fetch('/data/sample-risks.json');
        const risksData = await risksResponse.json();
        
        for (const risk of risksData.risks) {
            await fetch('/api/risks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(risk)
            });
        }

        showAlert('Sample data generated successfully!', 'success');
        location.reload();
    } catch (error) {
        console.error('Sample data generation error:', error);
        showAlert('Error generating sample data', 'danger');
    }
}

// Add export/import buttons to the interface
function addExportImportButtons() {
    const reportsSection = document.getElementById('reports-section');
    if (reportsSection) {
        const exportImportDiv = document.createElement('div');
        exportImportDiv.className = 'row mt-4';
        exportImportDiv.innerHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-download me-2"></i>Data Export/Import</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Export Data</h6>
                                <button class="btn btn-success me-2" onclick="exportAllData()">
                                    <i class="fas fa-download me-1"></i>Export All Data (JSON)
                                </button>
                                <button class="btn btn-info me-2" onclick="exportRisksCSV()">
                                    <i class="fas fa-file-csv me-1"></i>Export Risks (CSV)
                                </button>
                                <button class="btn btn-info" onclick="exportFrameworksCSV()">
                                    <i class="fas fa-file-csv me-1"></i>Export Frameworks (CSV)
                                </button>
                            </div>
                            <div class="col-md-6">
                                <h6>Import Data</h6>
                                <input type="file" id="importFile" accept=".json" class="form-control mb-2">
                                <button class="btn btn-warning me-2" onclick="handleFileImport()">
                                    <i class="fas fa-upload me-1"></i>Import Data
                                </button>
                                <button class="btn btn-primary" onclick="generateSampleData()">
                                    <i class="fas fa-plus me-1"></i>Generate Sample Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        reportsSection.appendChild(exportImportDiv);
    }
}

// Handle file import
function handleFileImport() {
    const fileInput = document.getElementById('importFile');
    if (fileInput.files[0]) {
        importData(fileInput.files[0]);
    } else {
        showAlert('Please select a file to import', 'warning');
    }
}

// Initialize export/import functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
    addExportImportButtons();
});
