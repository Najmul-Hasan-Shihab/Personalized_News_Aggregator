import React, { useState } from "react";
import { registerUser } from "../../services/api";
import "./AuthPage.css";

const RegisterForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!agree) {
      setError("❌ You must agree to the terms.");
      return;
    }
    
    setLoading(true);
    
    try {
      await registerUser(formData.username, formData.password);
      alert("✅ Registration successful! Please login.");
      onSwitch();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.username?.[0] || 
                          err.response?.data?.password?.[0] ||
                          "❌ Something went wrong. Try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join Echorithm to get personalized news</p>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="checkbox-group">
          <input
            id="terms"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label htmlFor="terms">
            I agree to the Terms & Conditions and confirm I am over 18.
          </label>
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          Already have an account?
          <button type="button" onClick={onSwitch}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
