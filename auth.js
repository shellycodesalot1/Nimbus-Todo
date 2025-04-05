document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on an auth page
    if (document.getElementById('login-form') || document.getElementById('signup-form')) {
        initAuth();
    }
});

function initAuth() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const microsoftLoginBtn = document.getElementById('microsoft-login');
    const microsoftSignupBtn = document.getElementById('microsoft-signup');
    
    // Event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
    
    if (microsoftLoginBtn) {
        microsoftLoginBtn.addEventListener('click', handleMicrosoftAuth);
    }
    
    if (microsoftSignupBtn) {
        microsoftSignupBtn.addEventListener('click', handleMicrosoftAuth);
    }
    
    // Check if user is already authenticated
    if (isAuthenticated()) {
        window.location.href = '../index.html';
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real app, this would call your authentication API
    authenticateUser(email, password)
        .then(user => {
            // Save auth token and user data
            localStorage.setItem('authToken', 'sample-token');
            localStorage.setItem('userData', JSON.stringify({
                name: user.name || 'User',
                email: user.email,
                avatar: user.avatar || '../assets/images/user-avatar.jpg'
            }));
            
            // Redirect to main app
            window.location.href = '../index.html';
        })
        .catch(error => {
            alert('Login failed: ' + error.message);
        });
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!document.getElementById('terms-agreement').checked) {
        alert('You must agree to the terms and privacy policy');
        return;
    }
    
    // In a real app, this would call your registration API
    registerUser(name, email, password)
        .then(user => {
            // Save auth token and user data
            localStorage.setItem('authToken', 'sample-token');
            localStorage.setItem('userData', JSON.stringify({
                name: user.name,
                email: user.email,
                avatar: user.avatar || '../assets/images/user-avatar.jpg'
            }));
            
            // Redirect to main app
            window.location.href = '../index.html';
        })
        .catch(error => {
            alert('Registration failed: ' + error.message);
        });
}

// Handle forgot password
function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    // In a real app, this would call your password reset API
    alert(`Password reset link sent to ${email}`);
}

// Handle Microsoft authentication
function handleMicrosoftAuth() {
    // In a real app, this would initiate Microsoft authentication flow
    alert('Microsoft authentication would be implemented here');
    
    // For demo purposes, we'll simulate a successful auth
    setTimeout(() => {
        localStorage.setItem('authToken', 'sample-microsoft-token');
        localStorage.setItem('userData', JSON.stringify({
            name: 'Microsoft User',
            email: 'microsoft@example.com',
            avatar: '../assets/images/user-avatar.jpg'
        }));
        window.location.href = '../index.html';
    }, 1000);
}

// Check if user is authenticated
function isAuthenticated() {
    // In a real app, this would check for a valid auth token
    return localStorage.getItem('authToken') !== null;
}

// Mock authentication function (replace with real API call)
function authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
        // Simulate API call delay
        setTimeout(() => {
            if (email === 'demo@example.com' && password === 'password') {
                resolve({
                    name: 'Demo User',
                    email: 'demo@example.com'
                });
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 500);
    });
}

// Mock registration function (replace with real API call)
function registerUser(name, email, password) {
    return new Promise((resolve, reject) => {
        // Simulate API call delay
        setTimeout(() => {
            if (email && password) {
                resolve({
                    name,
                    email
                });
            } else {
                reject(new Error('Registration failed'));
            }
        }, 500);
    });
}