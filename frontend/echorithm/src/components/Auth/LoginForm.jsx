import React, { useState } from "react";
import axios from "axios";
import "./AuthPage.css"; // only this CSS

const LoginForm = ({ onSwitch }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        username,
        password,
      });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      alert("✅ Login successful!");
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
      setError("❌ Invalid username or password.");
    }
  };

  return (
    <div>
      <div className="auth-header">
        <h2>Login</h2>
        <button
          type="button"
          className="close-btn"
          aria-label="Close"
          onClick={() => (window.location.href = "/")}
        >
          &times;
        </button>
      </div>

      <form className="auth-form" onSubmit={handleLogin} noValidate>
        <div className="form-group">
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-links">
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset coming soon!"); }}>Forgot password?</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>New user?</a>
        </div>

        <button type="submit" className="auth-btn">Sign In</button>

        {error && <p className="error-message" role="alert">{error}</p>}

        <div className="divider"><span>OR</span></div>

        <button
          type="button"
          className="google-btn"
          onClick={() => alert("Google login coming soon!")}
        >
          <span className="google-icon">G</span>
          Sign in using Google
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
