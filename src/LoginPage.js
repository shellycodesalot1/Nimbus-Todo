import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleMicrosoftLogin } from "./azure"; // Adjust path if needed
import { useAuth } from "./context/AuthContext";
import "./LoginPage.css"; 

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  // Microsoft login handling
  const handleMicrosoftSignIn = async () => {
    try {
      const userInfo = await handleMicrosoftLogin();
      console.log("✅ User logged in:", userInfo);
      login(userInfo); // Store user info in AuthContext
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      console.error("❌ Microsoft login failed:", err);
      setError("Microsoft login failed: " + err.message); // Show error message
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

          {/* Display error message if login fails */}
          {error && <div className="error-message">{error}</div>}

          {/* Email/password form disabled for UI purposes */}
          <form>
            <input
              type="email"
              placeholder="Email"
              disabled
              // You could pre-fill this if needed, as it's just for UI
            />
            <input
              type="password"
              placeholder="Password"
              disabled
              // You could pre-fill this if needed, as it's just for UI
            />
            <button type="submit" disabled>Sign In</button>
          </form>

          <div className="social-auth">
            <p>Or sign in with</p>
            <button 
              className="microsoft-btn"
              onClick={handleMicrosoftSignIn} // Microsoft login button
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

