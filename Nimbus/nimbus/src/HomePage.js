import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/signup");
  };

    return (
        <div className="entry-page-wrapper">
            <div className="entry-logo-container">
                <img src="/images/cloud_logo.png" alt="Nimbus logo" className="homepage-logo" />
                 <div className="entry-logo-intro">
                    <h2>Manage tasks effortlessly in the cloud</h2>
                </div>
                <div>
                <button className="start-button" onClick={handleEnter}> Get Started </button>
                </div>
            </div>

            
        </div>
    );
}

export default HomePage;