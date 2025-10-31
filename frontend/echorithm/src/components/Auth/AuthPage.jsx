import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthPage.css";

const AuthPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode");
  
  const [isRegistering, setIsRegistering] = useState(mode === "signup");

  useEffect(() => {
    // Update isRegistering when URL mode parameter changes
    setIsRegistering(mode === "signup");
  }, [mode]);

  const handleToggle = () => setIsRegistering((p) => !p);

  return (
    <main className="auth-page">
      <div className="auth-container">
        {/* Left side - Branding Card */}
        <div className="auth-branding-card">
            <div className="auth-logo">
              <span className="logo-icon">🧠</span>
              <span className="logo-text">Echorithm</span>
            </div>
            
            <h2 className="auth-title">
              {isRegistering ? "Join Our Community" : "Welcome Back"}
            </h2>
            
            <p className="auth-subtitle">
              {isRegistering
                ? "Create your account to start exploring personalized news powered by AI"
                : "Sign in to continue your personalized news journey"}
            </p>

            <div className="auth-features">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <span>AI-Powered Summarization</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📰</span>
                <span>Multi-Source Aggregation</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Personalized Feed</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💭</span>
                <span>Sentiment Analysis</span>
              </div>
            </div>

            <div className="auth-team-info">
              <p className="team-label">Software Development Project</p>
              <p className="team-members">
                FAHIM • MISKAT • SHIHAB 
              </p>
              <p className="team-supervisor">Supervised by Mohammad Arfizurrahman</p>
            </div>
          </div>

          {/* Right side - Form Card */}
          <div className="auth-form-card">
            {isRegistering ? (
              <RegisterForm onSwitch={handleToggle} />
            ) : (
              <LoginForm onSwitch={handleToggle} />
            )}
        </div>
      </div>
    </main>
  );
};

export default AuthPage;