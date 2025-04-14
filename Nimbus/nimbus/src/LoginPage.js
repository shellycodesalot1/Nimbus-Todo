import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function EntryPage() {
    const Navigate = useNavigate();

    const handleEnter = () => {
        Navigate("/login");
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-left-content">
                    <h1> Welcome Back! </h1>
                    <p>Log in to your Productivity Pro account to manage your tasks, set reminders, and boost your productivity.</p>
                    <img src="../assets/images/login-illustration.svg" alt="Login Illustration" style="max-width: 300px;" />
                </div>
            </div>
            
            <div className="auth-right">
                <div className="auth-form-container">
                    <div className="auth-logo">
                        <i className="fas fa-rocket"></i>
                        <h2>Productivity Pro</h2>
                    </div>
                </div>
            </div>
        </div>
    )
} 