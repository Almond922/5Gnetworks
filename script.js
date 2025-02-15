const CORRECT_PASSWORD = '5GNetwork2025';
let passwordHistory = [];
let securityAlerts = [];
let currentTheme = {
    color: '#1a73e8',
    isDark: false,
    isCompact: false
};

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const disconnectBtn = document.getElementById('disconnectBtn');
const speedMetric = document.getElementById('speedMetric');
const latencyMetric = document.getElementById('latencyMetric');
const signalMetric = document.getElementById('signalMetric');
const devicesList = document.getElementById('devicesList');
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const passwordInput = document.getElementById('passwordInput');
const passwordStrength = document.getElementById('passwordStrength');
const passwordRequirements = document.getElementById('passwordRequirements');
const changePasswordForm = document.getElementById('changePasswordForm');
const colorOptions = document.querySelectorAll('.color-option');
const darkModeToggle = document.getElementById('darkMode');
const compactModeToggle = document.getElementById('compactMode');

document.addEventListener("DOMContentLoaded", function () {

    // Toggle Dark Mode
    const themeToggleButton = document.getElementById("theme-toggle");
    themeToggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // Handle Login
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        // Simulate login success
        document.querySelector(".login-container").classList.remove("active");
        document.querySelector(".dashboard-container").classList.add("active");
    });

    // Tab Navigation
    const tabs = document.querySelectorAll(".nav-tab");
    const tabContents = document.querySelectorAll(".tab-content");
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            // Remove active class from all tabs and tab contents
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Add active class to clicked tab and corresponding content
            tab.classList.add("active");
            const tabContent = document.querySelector(`.${tab.getAttribute("data-tab")}`);
            tabContent.classList.add("active");
        });
    });

    // Color Picker - Change Theme Color
    const colorOptions = document.querySelectorAll(".color-option");
    colorOptions.forEach(option => {
        option.addEventListener("click", function () {
            document.documentElement.style.setProperty('--primary-color', option.style.backgroundColor);
            colorOptions.forEach(opt => opt.classList.remove("active"));
            option.classList.add("active");
        });
    });

    // Password Strength Indicator (simulating password input)
    const passwordInputs = document.querySelectorAll("input[type=password]");
    passwordInputs.forEach(input => {
        input.addEventListener("input", function () {
            const strength = document.querySelectorAll(".password-strength");
            strength.forEach(el => el.style.display = "none");

            const value = input.value;
            if (value.length < 6) {
                document.querySelector(".strength-weak").style.display = "block";
            } else if (value.length >= 6 && value.length < 12) {
                document.querySelector(".strength-medium").style.display = "block";
            } else {
                document.querySelector(".strength-strong").style.display = "block";
            }
        });
    });

});

// Mock devices data
const mockDevices = [
    { id: 1, name: "iPhone 15 Pro", type: "smartphone", status: "active", ipAddress: "192.168.1.101" },
    { id: 2, name: "Samsung Galaxy S24", type: "smartphone", status: "idle", ipAddress: "192.168.1.102" },
    { id: 3, name: "iPad Pro", type: "tablet", status: "active", ipAddress: "192.168.1.103" }
];

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    Object.values(requirements).forEach(req => {
        if (req) strength++;
    });

    updatePasswordRequirements(requirements);

    if (strength < 2) return { class: 'strength-weak', text: 'Weak' };
    if (strength < 4) return { class: 'strength-medium', text: 'Medium' };
    return { class: 'strength-strong', text: 'Strong' };
}

function updatePasswordRequirements(requirements) {
    document.getElementById('lengthReq').classList.toggle('met', requirements.length);
    document.getElementById('upperReq').classList.toggle('met', requirements.upper);
    document.getElementById('lowerReq').classList.toggle('met', requirements.lower);
    document.getElementById('numberReq').classList.toggle('met', requirements.number);
    document.getElementById('specialReq').classList.toggle('met', requirements.special);
}

// Network simulation
let simulationInterval;

// Function to start network simulation
function startNetworkSimulation() {
    // Initial network state
    let networkState = {
        speed: 2500,        // Starting at 2.5 Gbps
        latency: 5,         // 5ms starting latency
        signalStrength: 90, // 90% signal strength
        frequency: 3.5,     // 3.5 GHz (common 5G frequency)
        packetLoss: 0.1,    // 0.1% packet loss
        jitter: 2,          // 2ms jitter
        connectionType: '5G-Advanced'
    };

    simulationInterval = setInterval(() => {
        // Simulate network speed fluctuations (2-4 Gbps for 5G)
        networkState.speed = Math.floor(Math.random() * 2000 + 2000);
        
        // Simulate latency changes (1-10ms for 5G)
        networkState.latency = Math.max(1, networkState.latency + (Math.random() - 0.5) * 2);
        networkState.latency = Math.min(10, Math.round(networkState.latency));
        
        // Simulate signal strength changes (0-100%)
        networkState.signalStrength = Math.max(0, Math.min(100,
            networkState.signalStrength + (Math.random() - 0.5) * 5
        ));
        
        // Simulate packet loss (0-1%)
        networkState.packetLoss = Math.max(0, Math.min(1,
            networkState.packetLoss + (Math.random() - 0.5) * 0.1
        ));
        
        // Simulate jitter (1-5ms)
        networkState.jitter = Math.max(1, Math.min(5,
            networkState.jitter + (Math.random() - 0.5)
        ));

        // Update UI with new values
        speedMetric.innerHTML = `
            <div class="metric-value">${(networkState.speed/1000).toFixed(2)} Gbps</div>
            <div class="metric-detail">Peak: ${(networkState.speed/1000 + 0.5).toFixed(2)} Gbps</div>
        `;

        latencyMetric.innerHTML = `
            <div class="metric-value">${networkState.latency.toFixed(1)} ms</div>
            <div class="metric-detail">Jitter: ${networkState.jitter.toFixed(1)} ms</div>
        `;

        signalMetric.innerHTML = `
            <div class="metric-value">${Math.round(networkState.signalStrength)}%</div>
            <div class="metric-detail">Packet Loss: ${networkState.packetLoss.toFixed(2)}%</div>
        `;

        // Update the charts with the new speed and latency values
        updateChart(networkState.speed / 1000); // Convert speed to Gbps
        updateLatencyChart(networkState.latency);

        // Add network quality indicator
        const qualityIndicator = document.getElementById('networkQuality');
        if (qualityIndicator) {
            let quality = 'Excellent';
            if (networkState.signalStrength < 60 || networkState.latency > 8) quality = 'Poor';
            else if (networkState.signalStrength < 80 || networkState.latency > 5) quality = 'Good';
            
            qualityIndicator.textContent = `Network Quality: ${quality}`;
            qualityIndicator.className = `quality-indicator quality-${quality.toLowerCase()}`;
        }

        // Simulate network events
        if (Math.random() < 0.05) { // 5% chance of event
            const events = [
                'Signal optimization in progress',
                'Switching to optimal frequency band',
                'Network congestion detected',
                'Bandwidth optimization active',
                'Carrier aggregation enabled'
            ];
            const event = events[Math.floor(Math.random() * events.length)];
            addSecurityAlert(event);
        }

        // Update connected devices' signal strength
        updateDeviceSignalStrength(networkState.signalStrength);

    }, 2000); // Update every 2 seconds

    // Return the interval ID for cleanup
    return simulationInterval;
}

// Add cleanup function
function stopNetworkSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
}

// Device Management
function updateDeviceStatuses() {
    mockDevices.forEach(device => {
        if (Math.random() > 0.8) {
            device.status = device.status === 'active' ? 'idle' : 'active';
        }
    });
    renderDevices();
}

function renderDevices() {
    devicesList.innerHTML = mockDevices.map(device => `
        <div class="device-item">
            <div>
                <h3>${device.name}</h3>
                <p>Type: ${device.type}</p>
                <p>IP: ${device.ipAddress}</p>
            </div>
            <div>
                <span class="status-${device.status}">${device.status}</span>
            </div>
        </div>
    `).join('');
}

// Password Management
function addPasswordHistoryEntry(date, action = 'Password changed') {
    passwordHistory.unshift({
        date: date,
        action: action
    });
    renderPasswordHistory();
}

function renderPasswordHistory() {
    const historyList = document.getElementById('passwordHistoryList');
    historyList.innerHTML = passwordHistory.map(entry => `
        <div class="password-history-item">
            <span>${entry.action}</span>
            <span>${entry.date.toLocaleString()}</span>
        </div>
    `).join('');
}

// Security Alerts
function addSecurityAlert(alert) {
    securityAlerts.unshift({
        date: new Date(),
        message: alert
    });
    renderSecurityAlerts();
}

function renderSecurityAlerts() {
    const alertsList = document.getElementById('securityAlertsList');
    if (alertsList) {
        alertsList.innerHTML = securityAlerts.map(alert => `
            <div class="alert">
                <p>${alert.message}</p>
                <small>${alert.date.toLocaleString()}</small>
            </div>
        `).join('');
    }
}

// Theme Management
function updateTheme() {
    document.documentElement.style.setProperty('--primary-color', currentTheme.color);
    document.body.classList.toggle('dark-mode', currentTheme.isDark);
    document.body.classList.toggle('compact-mode', currentTheme.isCompact);
    localStorage.setItem('dashboardTheme', JSON.stringify(currentTheme));
}

function loadTheme() {
    const savedTheme = localStorage.getItem('dashboardTheme');
    if (savedTheme) {
        currentTheme = JSON.parse(savedTheme);
        darkModeToggle.checked = currentTheme.isDark;
        compactModeToggle.checked = currentTheme.isCompact;
        updateTheme();
    }
}

// Event Listeners
passwordInput.addEventListener('input', (e) => {
    const strength = checkPasswordStrength(e.target.value);
    passwordStrength.className = 'password-strength ' + strength.class;
    passwordStrength.textContent = 'Password Strength: ' + strength.text;
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;
    
    if (password === CORRECT_PASSWORD) {
        loginContainer.classList.remove('active');
        dashboardContainer.classList.add('active');
        startNetworkSimulation();
        renderDevices();
        addPasswordHistoryEntry(new Date(), 'Successful login');
        addSecurityAlert('New login detected');
    } else {
        addSecurityAlert('Failed login attempt');
        alert('Invalid password. Please try again.');
    }
});

disconnectBtn.addEventListener('click', () => {
    loginContainer.classList.add('active');
    dashboardContainer.classList.remove('active');
    passwordInput.value = '';
    stopNetworkSimulation();
    addSecurityAlert('User  disconnected');
});

// Tab Navigation
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        navTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');
    });
});

// Theme Customization
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        currentTheme.color = option.dataset.color;
        colorOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        updateTheme();
    });
});

darkModeToggle.addEventListener('change', (e) => {
    currentTheme.isDark = e.target.checked;
    updateTheme();
});

compactModeToggle.addEventListener('change', (e) => {
    currentTheme.isCompact = e.target.checked;
    updateTheme();
});

// Password Change Form
changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (currentPassword !== CORRECT_PASSWORD) {
        alert('Current password is incorrect');
        addSecurityAlert('Failed password change attempt');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }

    const strength = checkPasswordStrength(newPassword);
    if (strength.class === 'strength-weak') {
        alert('Password is too weak. Please choose a stronger password.');
        return;
    }

    // In a real application, you would update the password in a secure way
    // For this demo, we'll just show a success message
    alert('Password changed successfully');
    addPasswordHistoryEntry(new Date());
    addSecurityAlert('Password was changed');
    changePasswordForm.reset();
});

// Initialize the chart for Network Speed in Gbps
const ctx = document.getElementById('speedChart').getContext('2d');
const speedChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Array of time labels (in seconds)
        datasets: [{
            label: 'Network Speed (Gbps)',  // Updated label for Gbps
            data: [], // Array of speed data points in Gbps
            borderColor: 'rgb(26, 115, 232)', // Blue color for the line
            fill: false,
            tension: 0.1,
        }]
    },
    options: {
        scales: {
            x: {
                min: 0,
                type: 'linear',  // Time-based X-axis
                position: 'bottom',
                ticks: {
                    stepSize: 1,  // Interval between labels in seconds
                    callback: function(value) {
                        return `${value}s`;  // Display seconds as a label
                    }
                },
                title: {
                    display: true,
                    text: 'Time (seconds)',  // X-Axis title
                }
            },
            y: {
                min: 0,
                max: 10, // Max 10 Gbps for clear visualization
                ticks: {
                    beginAtZero: true,
                    stepSize: 1,  // Step size to show Gbps values
                    callback: function(value) {
                        return `${value} Gbps`;  // Format as Gbps
                    }
                },
                title: {
                    display: true,
                    text: 'Network Speed (Gbps)',  // Y-Axis title
                }
            }
        },
        responsive: true, // Ensure it resizes dynamically
    }
});

// Function to update the chart with new data in Gbps
function updateChart(newSpeedGbps) {
    const currentTime = speedChart.data.labels.length ? speedChart.data.labels[speedChart.data.labels.length - 1] + 1 : 0; // Increment time in seconds

    // Add the new data point for Gbps
    speedChart.data.labels.push(currentTime);
    speedChart.data.datasets[0].data.push(newSpeedGbps);

    // Keep only the last 30 data points for better performance
    if (speedChart.data.labels.length > 100) {
        speedChart.data.labels.shift();
        speedChart.data.datasets[0].data.shift();
    }

    // Update the chart
    speedChart.update();
}

// Initialize the chart for Latency in ms
// Initialize the chart for Latency in ms
const ctxLatency = document.getElementById('latencyChart').getContext('2d');
const latencyChart = new Chart(ctxLatency, {
    type: 'line',
    data: {
        labels: [], // Array of time labels (in seconds)
        datasets: [{
            label: 'Latency (ms)',  // Label for latency
            data: [], // Array of latency data points in ms
            borderColor: 'rgb(255, 99, 132)', // Red color for the latency line
            fill: false,
            tension: 0.1,
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',  // Time-based X-axis
                position: 'bottom',
                ticks: {
                    stepSize: 1,  // Interval between labels in seconds
                    callback: function(value) {
                        return `${value}s`;  // Display seconds as a label
                    }
                },
                title: {
                    display: true,
                    text: 'Time (seconds)',  // X-Axis title
                }
            },
            y: {
                min: 0,
                max: 10, // Max 20ms for clear visualization
                ticks: {
                    beginAtZero: true,
                    stepSize: 1,  // Step size to show ms values
                    callback: function(value) {
                        return `${value} ms`;  // Format as ms
                    }
                },
                title: {
                    display: true,
                    text: 'Latency (ms)',  // Y-Axis title
                }
            }
        },
        responsive: true, // Ensure it resizes dynamically
    }
});

// Function to update the latency chart with new latency values in ms
function updateLatencyChart(newLatency) {
    const currentTime = latencyChart.data.labels.length ? latencyChart.data.labels[latencyChart.data.labels.length - 1] + 1 : 0; // Increment time in seconds

    // Add the new data point for latency
    latencyChart.data.labels.push(currentTime);
    latencyChart.data.datasets[0].data.push(newLatency);

    // Keep only the last 30 data points for better performance
    if (latencyChart.data.labels.length > 500) {
        latencyChart.data.labels.shift();
        latencyChart.data.datasets[0].data.shift();
    }

    // Update the chart
    latencyChart.update();
}

// Example to simulate latency data updates
function simulateLatencyData() {
    setInterval(() => {
        const newLatency = Math.random() * 5 + 1; // Random latency between 1-10 ms

        // Update the chart with new latency data
        updateLatencyChart(newLatency);
    }, 1000); // Update every second
}

// Start the simulation
simulateLatencyData();


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    renderSecurityAlerts();
    
    // Add initial security alert
    addSecurityAlert('Dashboard initialized');
});

// Automatic logout after inactivity
let inactivityTimeout;
const INACTIVE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        if (dashboardContainer.classList.contains('active')) {
            addSecurityAlert('Auto-logout due to inactivity');
            disconnectBtn.click();
        }
    }, INACTIVE_TIMEOUT);
}

// Reset timer on user activity
['click', 'mousemove', 'keypress'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
});