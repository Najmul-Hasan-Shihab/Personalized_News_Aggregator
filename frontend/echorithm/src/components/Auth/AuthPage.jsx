import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthPage.css";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleToggle = () => setIsRegistering((p) => !p);

  return (
    <div className="auth-page">
      <div className="auth-card" role="dialog" aria-modal="true">
        {/* Left banner */}
        <div className="banner-column">
          <div className="banner-inner">
            <h1>{isRegistering ? "Create Account" : "Welcome Back"}</h1>
            <p className="lead">
              {isRegistering
                ? "Join us today and be part of something amazing."
                : "Sign in to continue your journey with us."}
            </p>

            <p className="banner-description">
              This is our SWE Final group project — a personalized News Aggregator.
              <br />
              Team: <strong>FAHIM</strong>, <strong>MISKAT</strong>, <strong>SHIHAB</strong>, <strong>TASIN</strong>.
              <br />
              Guided by <strong>Mohammad Arfizurrahman</strong>.
            </p>

            <button className="switch-btn" onClick={handleToggle} type="button">
              {isRegistering ? "Already have an account? Sign In" : "New here? Register"}
            </button>
          </div>

          <div className="banner-footer">www.KING-ARFIZ.COM</div>
        </div>

        {/* Right form */}
        <div className="inner-form">
          <div className="form-wrapper">
            {isRegistering ? (
              <RegisterForm onSwitch={handleToggle} />
            ) : (
              <LoginForm onSwitch={handleToggle} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
