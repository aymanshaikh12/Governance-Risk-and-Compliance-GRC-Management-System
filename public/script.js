// CompSec - Security Compliance Management System - Frontend JavaScript

// Global variables
let currentRisks = [];
let currentAssessments = [];
let currentFrameworks = [];
let riskChart = null;
let complianceChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    loadFrameworks();
    loadRisks();
    loadAssessments();
});

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('fade-in');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[href="#${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'risks':
            loadRisks();
            break;
        case 'assessments':
            loadAssessments();
            break;
        case 'frameworks':
            loadFrameworks();
            break;
    }
}

// Dashboard functions
async function loadDashboard() {
    try {
        const response = await fetch('/api/compliance/dashboard');
        const data = await response.json();
        
        // Update metrics
        document.getElementById('critical-risks').textContent = data.riskStats.criticalRisks;
        document.getElementById('high-risks').textContent = data.riskStats.highRisks;
        document.getElementById('total-assessments').textContent = data.assessmentStats.totalAssessments;
        document.getElementById('compliance-percentage').textContent = 
            Math.round(data.assessmentStats.avgCompliancePercentage) + '%';
        
        // Update recent activities
        updateRecentRisks(data.recentActivities.risks);
        updateUpcomingReviews(data.upcomingReviews);
        
        // Update charts
        updateRiskChart(data.riskStats);
        updateComplianceChart(data.assessmentStats);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Error loading dashboard data', 'danger');
    }
}

function updateRecentRisks(risks) {
    const container = document.getElementById('recent-risks');
    if (risks.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent risks found</p>';
        return;
    }
    
    container.innerHTML = risks.map(risk => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <strong>${risk.title}</strong>
                <span class="badge ${getRiskLevelClass(risk.riskLevel)} ms-2">${risk.riskLevel}</span>
            </div>
            <small class="text-muted">${formatDate(risk.createdAt)}</small>
        </div>
    `).join('');
}

function updateUpcomingReviews(reviews) {
    const container = document.getElementById('upcoming-reviews');
    if (reviews.length === 0) {
        container.innerHTML = '<p class="text-muted">No upcoming reviews</p>';
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <strong>${review.title}</strong>
                <span class="badge ${getRiskLevelClass(review.riskLevel)} ms-2">${review.riskLevel}</span>
            </div>
            <small class="text-muted">${formatDate(review.nextReviewDate)}</small>
        </div>
    `).join('');
}

function updateRiskChart(riskStats) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    if (riskChart) {
        riskChart.destroy();
    }
    
    riskChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low', 'Very Low'],
            datasets: [{
                data: [
                    riskStats.criticalRisks || 0,
                    riskStats.highRisks || 0,
                    riskStats.mediumRisks || 0,
                    riskStats.lowRisks || 0,
                    riskStats.veryLowRisks || 0
                ],
                backgroundColor: [
                    '#dc3545',
                    '#fd7e14',
                    '#ffc107',
                    '#20c997',
                    '#6c757d'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateComplianceChart(assessmentStats) {
    const ctx = document.getElementById('complianceChart').getContext('2d');
    
    if (complianceChart) {
        complianceChart.destroy();
    }
    
    // Mock data for trends - in real app, this would come from the API
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const complianceData = [85, 87, 89, 91, 88, 92];
    
    complianceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Compliance %',
                data: complianceData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Risk Management functions
async function loadRisks() {
    try {
        const response = await fetch('/api/risks');
        const data = await response.json();
        currentRisks = data.risks;
        displayRisks(currentRisks);
    } catch (error) {
        console.error('Error loading risks:', error);
        showAlert('Error loading risks', 'danger');
    }
}

function displayRisks(risks) {
    const tbody = document.getElementById('risks-table-body');
    
    if (risks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No risks found</td></tr>';
        return;
    }
    
    tbody.innerHTML = risks.map(risk => `
        <tr>
            <td><strong>${risk.riskId}</strong></td>
            <td>${risk.title}</td>
            <td><span class="badge bg-secondary">${risk.category}</span></td>
            <td><span class="badge ${getRiskLevelClass(risk.riskLevel)}">${risk.riskLevel}</span></td>
            <td><span class="badge ${getTreatmentClass(risk.treatment)}">${risk.treatment}</span></td>
            <td>${risk.treatmentOwner}</td>
            <td><span class="badge ${getStatusClass(risk.status)}">${risk.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewRisk('${risk._id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editRisk('${risk._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteRisk('${risk._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showAddRiskModal() {
    const modal = new bootstrap.Modal(document.getElementById('addRiskModal'));
    modal.show();
}

function updateRiskScore() {
    const likelihoodSelect = document.getElementById('risk-likelihood');
    const impactSelect = document.getElementById('risk-impact');
    
    const likelihoodScore = parseInt(likelihoodSelect.selectedOptions[0]?.dataset.score) || 0;
    const impactScore = parseInt(impactSelect.selectedOptions[0]?.dataset.score) || 0;
    
    const riskScore = likelihoodScore * impactScore;
    const riskLevel = getRiskLevelFromScore(riskScore);
    
    document.getElementById('risk-score-display').textContent = riskScore;
    document.getElementById('risk-level-display').textContent = riskLevel;
    document.getElementById('risk-level-display').className = `badge ${getRiskLevelClass(riskLevel)}`;
}

function getRiskLevelFromScore(score) {
    if (score >= 20) return 'Critical';
    if (score >= 15) return 'Very High';
    if (score >= 10) return 'High';
    if (score >= 6) return 'Medium';
    if (score >= 3) return 'Low';
    return 'Very Low';
}

async function addRisk() {
    try {
        const form = document.getElementById('addRiskForm');
        const formData = new FormData(form);
        
        const riskData = {
            title: document.getElementById('risk-title').value,
            description: document.getElementById('risk-description').value,
            category: document.getElementById('risk-category').value,
            subCategory: 'General', // Default value
            likelihood: document.getElementById('risk-likelihood').value,
            likelihoodScore: parseInt(document.getElementById('risk-likelihood').selectedOptions[0].dataset.score),
            impact: document.getElementById('risk-impact').value,
            impactScore: parseInt(document.getElementById('risk-impact').selectedOptions[0].dataset.score),
            businessUnit: document.getElementById('risk-business-unit').value,
            asset: document.getElementById('risk-asset').value,
            threat: document.getElementById('risk-threat').value,
            vulnerability: document.getElementById('risk-vulnerability').value,
            treatment: document.getElementById('risk-treatment').value,
            treatmentDescription: document.getElementById('risk-treatment-description').value,
            treatmentOwner: document.getElementById('risk-treatment-owner').value,
            nextReviewDate: document.getElementById('risk-next-review').value,
            createdBy: document.getElementById('risk-created-by').value,
            updatedBy: document.getElementById('risk-created-by').value
        };
        
        const response = await fetch('/api/risks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(riskData)
        });
        
        if (response.ok) {
            const newRisk = await response.json();
            showAlert('Risk added successfully', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addRiskModal')).hide();
            form.reset();
            loadRisks();
            loadDashboard();
        } else {
            const error = await response.json();
            showAlert('Error adding risk: ' + error.message, 'danger');
        }
    } catch (error) {
        console.error('Error adding risk:', error);
        showAlert('Error adding risk', 'danger');
    }
}

async function viewRisk(riskId) {
    try {
        const response = await fetch(`/api/risks/${riskId}`);
        const risk = await response.json();
        
        const content = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Basic Information</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Risk ID:</strong></td><td>${risk.riskId}</td></tr>
                        <tr><td><strong>Title:</strong></td><td>${risk.title}</td></tr>
                        <tr><td><strong>Category:</strong></td><td>${risk.category}</td></tr>
                        <tr><td><strong>Description:</strong></td><td>${risk.description}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>Risk Assessment</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Likelihood:</strong></td><td>${risk.likelihood}</td></tr>
                        <tr><td><strong>Impact:</strong></td><td>${risk.impact}</td></tr>
                        <tr><td><strong>Risk Score:</strong></td><td>${risk.riskScore}</td></tr>
                        <tr><td><strong>Risk Level:</strong></td><td><span class="badge ${getRiskLevelClass(risk.riskLevel)}">${risk.riskLevel}</span></td></tr>
                    </table>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-6">
                    <h6>Treatment Information</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Treatment:</strong></td><td><span class="badge ${getTreatmentClass(risk.treatment)}">${risk.treatment}</span></td></tr>
                        <tr><td><strong>Description:</strong></td><td>${risk.treatmentDescription}</td></tr>
                        <tr><td><strong>Owner:</strong></td><td>${risk.treatmentOwner}</td></tr>
                        <tr><td><strong>Status:</strong></td><td><span class="badge ${getStatusClass(risk.treatmentStatus)}">${risk.treatmentStatus}</span></td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>Context</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Business Unit:</strong></td><td>${risk.businessUnit}</td></tr>
                        <tr><td><strong>Asset:</strong></td><td>${risk.asset}</td></tr>
                        <tr><td><strong>Threat:</strong></td><td>${risk.threat}</td></tr>
                        <tr><td><strong>Vulnerability:</strong></td><td>${risk.vulnerability}</td></tr>
                    </table>
                </div>
            </div>
        `;
        
        document.getElementById('risk-details-content').innerHTML = content;
        const modal = new bootstrap.Modal(document.getElementById('riskDetailsModal'));
        modal.show();
    } catch (error) {
        console.error('Error viewing risk:', error);
        showAlert('Error loading risk details', 'danger');
    }
}

async function deleteRisk(riskId) {
    if (confirm('Are you sure you want to delete this risk?')) {
        try {
            const response = await fetch(`/api/risks/${riskId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showAlert('Risk deleted successfully', 'success');
                loadRisks();
                loadDashboard();
            } else {
                const error = await response.json();
                showAlert('Error deleting risk: ' + error.message, 'danger');
            }
        } catch (error) {
            console.error('Error deleting risk:', error);
            showAlert('Error deleting risk', 'danger');
        }
    }
}

function filterRisks() {
    const category = document.getElementById('risk-category-filter').value;
    const riskLevel = document.getElementById('risk-level-filter').value;
    const treatment = document.getElementById('risk-treatment-filter').value;
    const search = document.getElementById('risk-search').value;
    
    let filteredRisks = currentRisks;
    
    if (category) {
        filteredRisks = filteredRisks.filter(risk => risk.category === category);
    }
    
    if (riskLevel) {
        filteredRisks = filteredRisks.filter(risk => risk.riskLevel === riskLevel);
    }
    
    if (treatment) {
        filteredRisks = filteredRisks.filter(risk => risk.treatment === treatment);
    }
    
    if (search) {
        filteredRisks = filteredRisks.filter(risk => 
            risk.title.toLowerCase().includes(search.toLowerCase()) ||
            risk.description.toLowerCase().includes(search.toLowerCase()) ||
            risk.riskId.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    displayRisks(filteredRisks);
}

function clearRiskFilters() {
    document.getElementById('risk-category-filter').value = '';
    document.getElementById('risk-level-filter').value = '';
    document.getElementById('risk-treatment-filter').value = '';
    document.getElementById('risk-search').value = '';
    displayRisks(currentRisks);
}

// Assessment functions
async function loadAssessments() {
    try {
        const response = await fetch('/api/assessments');
        const data = await response.json();
        currentAssessments = data.assessments;
        displayAssessments(currentAssessments);
    } catch (error) {
        console.error('Error loading assessments:', error);
        showAlert('Error loading assessments', 'danger');
    }
}

function displayAssessments(assessments) {
    const container = document.getElementById('assessments-cards');
    
    if (assessments.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">No assessments found</p></div>';
        return;
    }
    
    container.innerHTML = assessments.map(assessment => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card assessment-card">
                <div class="card-body">
                    <h5 class="card-title">${assessment.name}</h5>
                    <p class="card-text text-muted">${assessment.description || 'No description'}</p>
                    <div class="mb-2">
                        <span class="badge bg-primary">${assessment.type}</span>
                        <span class="badge ${getStatusClass(assessment.status)} ms-1">${assessment.status}</span>
                    </div>
                    <div class="mb-2">
                        <small class="text-muted">Framework: ${assessment.framework?.name || 'Unknown'}</small>
                    </div>
                    <div class="mb-2">
                        <small class="text-muted">Compliance: ${Math.round(assessment.compliancePercentage || 0)}%</small>
                        <div class="assessment-progress mt-1">
                            <div class="assessment-progress-bar" style="width: ${assessment.compliancePercentage || 0}%"></div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <small class="text-muted">${formatDate(assessment.createdAt)}</small>
                        <div>
                            <button class="btn btn-sm btn-outline-primary" onclick="viewAssessment('${assessment._id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Framework functions
async function loadFrameworks() {
    try {
        const response = await fetch('/api/frameworks');
        currentFrameworks = await response.json();
        displayFrameworks(currentFrameworks);
    } catch (error) {
        console.error('Error loading frameworks:', error);
        showAlert('Error loading frameworks', 'danger');
    }
}

function displayFrameworks(frameworks) {
    const container = document.getElementById('frameworks-cards');
    
    if (frameworks.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">No frameworks found</p></div>';
        return;
    }
    
    container.innerHTML = frameworks.map(framework => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card framework-card" onclick="viewFramework('${framework._id}')">
                <div class="card-body text-center">
                    <div class="framework-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h5 class="card-title">${framework.name}</h5>
                    <p class="card-text text-muted">${framework.description}</p>
                    <div class="mb-2">
                        <span class="badge bg-secondary">${framework.type}</span>
                        <span class="badge bg-info ms-1">v${framework.version}</span>
                    </div>
                    <div class="mb-2">
                        <small class="text-muted">${framework.controls?.length || 0} Controls</small>
                    </div>
                    <div class="d-flex justify-content-between">
                        <small class="text-muted">${framework.status}</small>
                        <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); viewFramework('${framework._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize data with sample data
async function initializeData() {
    try {
        showAlert('Initializing sample data...', 'info');
        
        // Initialize frameworks
        const frameworkResponse = await fetch('/api/frameworks/initialize', {
            method: 'POST'
        });
        
        if (frameworkResponse.ok) {
            showAlert('Sample data initialized successfully!', 'success');
            loadFrameworks();
            loadDashboard();
        } else {
            showAlert('Error initializing sample data', 'danger');
        }
    } catch (error) {
        console.error('Error initializing data:', error);
        showAlert('Error initializing sample data', 'danger');
    }
}

// Utility functions
function getRiskLevelClass(riskLevel) {
    const classes = {
        'Critical': 'risk-critical',
        'Very High': 'risk-high',
        'High': 'risk-high',
        'Medium': 'risk-medium',
        'Low': 'risk-low',
        'Very Low': 'risk-very-low'
    };
    return classes[riskLevel] || 'badge-secondary';
}

function getTreatmentClass(treatment) {
    const classes = {
        'Avoid': 'treatment-avoid',
        'Transfer': 'treatment-transfer',
        'Mitigate': 'treatment-mitigate',
        'Accept': 'treatment-accept'
    };
    return classes[treatment] || 'badge-secondary';
}

function getStatusClass(status) {
    const classes = {
        'Active': 'status-active',
        'Inactive': 'status-inactive',
        'Closed': 'status-closed',
        'Under Review': 'status-under-review',
        'Completed': 'status-active',
        'In Progress': 'status-under-review',
        'Planned': 'status-inactive'
    };
    return classes[status] || 'badge-secondary';
}

function getPriorityClass(priority) {
    const classes = {
        'Critical': 'bg-danger',
        'High': 'bg-warning',
        'Medium': 'bg-info',
        'Low': 'bg-success'
    };
    return classes[priority] || 'bg-secondary';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Placeholder functions for future implementation
function showAddAssessmentModal() {
    showAlert('Assessment creation feature coming soon!', 'info');
}

function showAddFrameworkModal() {
    showAlert('Framework creation feature coming soon!', 'info');
}

function showUploadFrameworkModal() {
    const modal = new bootstrap.Modal(document.getElementById('uploadFrameworkModal'));
    modal.show();
}

async function uploadFramework() {
    const fileInput = document.getElementById('framework-file');
    const frameworkType = document.getElementById('upload-framework-type').value;
    
    if (!fileInput.files[0]) {
        showAlert('Please select a file to upload', 'warning');
        return;
    }
    
    try {
        const file = fileInput.files[0];
        
        // Read the file content
        const fileContent = await readFileAsText(file);
        let frameworkData;
        
        try {
            frameworkData = JSON.parse(fileContent);
        } catch (parseError) {
            showAlert('Invalid JSON file. Please check the file format.', 'danger');
            return;
        }
        
        // Handle both single framework and multiple frameworks
        const frameworks = frameworkData.frameworks || [frameworkData];
        
        let createdCount = 0;
        let updatedCount = 0;
        
        for (const framework of frameworks) {
            const response = await fetch('/api/frameworks/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...framework,
                    type: frameworkType
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            
            const result = await response.json();
            if (result.action === 'created') {
                createdCount++;
            } else if (result.action === 'updated') {
                updatedCount++;
            }
        }
        
        let message = '';
        if (createdCount > 0 && updatedCount > 0) {
            message = `Successfully processed ${frameworks.length} framework(s): ${createdCount} created, ${updatedCount} updated!`;
        } else if (createdCount > 0) {
            message = `Successfully created ${createdCount} framework(s)!`;
        } else if (updatedCount > 0) {
            message = `Successfully updated ${updatedCount} framework(s)!`;
        } else {
            message = `Successfully processed ${frameworks.length} framework(s)!`;
        }
        
        showAlert(message, 'success');
        bootstrap.Modal.getInstance(document.getElementById('uploadFrameworkModal')).hide();
        loadFrameworks();
        
    } catch (error) {
        console.error('Error uploading framework:', error);
        showAlert('Error uploading framework: ' + error.message, 'danger');
    }
}

// Helper function to read file as text
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}

function viewAssessment(assessmentId) {
    showAlert('Assessment details feature coming soon!', 'info');
}

async function viewFramework(frameworkId) {
    try {
        const response = await fetch(`/api/frameworks/${frameworkId}`);
        const framework = await response.json();
        
        const content = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Framework Information</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Name:</strong></td><td>${framework.name}</td></tr>
                        <tr><td><strong>Version:</strong></td><td>${framework.version}</td></tr>
                        <tr><td><strong>Type:</strong></td><td>${framework.type}</td></tr>
                        <tr><td><strong>Status:</strong></td><td><span class="badge ${getStatusClass(framework.status)}">${framework.status}</span></td></tr>
                        <tr><td><strong>Publisher:</strong></td><td>${framework.publisher || 'N/A'}</td></tr>
                        <tr><td><strong>Website:</strong></td><td><a href="${framework.website || '#'}" target="_blank">${framework.website || 'N/A'}</a></td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>Assessment Criteria</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Frequency:</strong></td><td>${framework.assessmentCriteria?.frequency || 'N/A'}</td></tr>
                        <tr><td><strong>Methodology:</strong></td><td>${framework.assessmentCriteria?.methodology || 'N/A'}</td></tr>
                        <tr><td><strong>Scoring Method:</strong></td><td>${framework.assessmentCriteria?.scoringMethod || 'N/A'}</td></tr>
                        <tr><td><strong>Pass Threshold:</strong></td><td>${framework.assessmentCriteria?.thresholds?.pass || 'N/A'}%</td></tr>
                    </table>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Description</h6>
                    <p>${framework.description}</p>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Controls (${framework.controls?.length || 0})</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Control ID</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(framework.controls || []).map(control => `
                                    <tr>
                                        <td><code>${control.controlId}</code></td>
                                        <td>${control.title}</td>
                                        <td><span class="badge bg-secondary">${control.category}</span></td>
                                        <td><span class="badge ${getPriorityClass(control.priority)}">${control.priority}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            ${framework.tags && framework.tags.length > 0 ? `
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Tags</h6>
                    <div>
                        ${framework.tags.map(tag => `<span class="badge bg-info me-1">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            ` : ''}
        `;
        
        document.getElementById('framework-details-content').innerHTML = content;
        const modal = new bootstrap.Modal(document.getElementById('frameworkDetailsModal'));
        modal.show();
    } catch (error) {
        console.error('Error viewing framework:', error);
        showAlert('Error loading framework details', 'danger');
    }
}

function editRisk(riskId) {
    showAlert('Risk editing feature coming soon!', 'info');
}

function generateRiskReport() {
    showAlert('Risk report generation feature coming soon!', 'info');
}

function generateComplianceReport() {
    showAlert('Compliance report generation feature coming soon!', 'info');
}
