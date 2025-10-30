import React, { useState } from "react";
import { loginUser } from "../../services/api";
import "./AuthPage.css"; // only this CSS

const LoginForm = ({ onSwitch }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      
      // Store tokens with consistent naming
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      
      alert("✅ Login successful!");
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
      setError("❌ Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your Echorithm account</p>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}

      <form className="auth-form" onSubmit={handleLogin} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          Don't have an account?
          <button type="button" onClick={onSwitch}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
