import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleSignUp = () => {
        // Basic validation
        if (email && password && password === confirmPassword) {
            // TODO: Add Azure AD B2C signup logic here
            navigate("/dashboard");
        } else {
            alert("Please check your inputs and ensure passwords match");
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
                    <h1>Sign Up</h1>
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
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button onClick={handleSignUp}>Sign Up</button>
                    <div className="signin-link">
                        Already have an account? <a href="/login">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;