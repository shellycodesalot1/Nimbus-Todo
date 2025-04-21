import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user, error: authError } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (authError) {
            setError(authError.message || 'An error occurred during authentication');
        }
    }, [authError]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await login();
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
        } catch (err) {
            setError('Login failed: ' + (err.message || 'Unknown error'));
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <div className="gif-section">
                    <div className="login-logo-container">
                        <div className="logo">
                            <h1>Nimbus To-Do</h1>
                        </div>
                    </div>
                </div>
                
                <div className="sign-in-box">
                    <h1>Sign In</h1>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="social-auth">
                        <button 
                            type="button" 
                            className="microsoft-btn"
                            onClick={handleLogin}
                        >
                            <i className="fab fa-microsoft"></i> Sign in with Microsoft
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p>Don't have an account? Your Microsoft account will be automatically registered.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;