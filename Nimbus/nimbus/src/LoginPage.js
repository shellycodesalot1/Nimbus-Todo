import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleMicrosoftLogin } from "./azure";
import { useAuth } from "./context/AuthContext";
import "./LoginPage.css"; 

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userInfo = await handleMicrosoftLogin();
            console.log('User logged in:', userInfo);
            await login(userInfo);
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
        } catch (error) {
            setError('Login failed: ' + error.message);
        }
    };

    const handleMicrosoftButton = async () => {
        try {
            const userInfo = await handleMicrosoftLogin();
            console.log('User logged in with Microsoft:', userInfo);
            await login(userInfo);
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
        } catch (error) {
            setError('Microsoft login failed: ' + error.message);
        }
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
                    <h1>Sign In</h1>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Sign In</button>
                    </form>
                    <div className="social-auth">
                        <p>Or sign in with</p>
                        <button 
                            className="microsoft-btn"
                            onClick={handleMicrosoftButton}
                        >
                            <i className="fab fa-microsoft"></i> Microsoft
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;