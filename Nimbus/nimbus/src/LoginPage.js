import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; 

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Simple validation
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        // TODO: Add actual login logic with Azure AD B2C here
        console.log('Logging in with:', email);
        
        // For now, navigate to dashboard after successful login
        navigate("/dashboard");
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <div className="gif-section">
                    <div className="logo-container">
                        <div className="logo">
                            <h1>Nimbus To-Do</h1>
                        </div>
                    </div>
                </div>
                <div className="sign-in-box">
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        {error && <div className="error-message">{error}</div>}
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    <p className="login-link">
                        Don't have an account? <a href="/signup">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;