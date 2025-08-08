import React, { useState } from "react";
import axios from "axios";
import "./AuthPage.css";

const RegisterForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

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
    try {
      await axios.post("http://127.0.0.1:8000/register/", formData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("✅ Registration successful!");
      onSwitch();
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div>
      <div className="auth-header">
        <h2>Create Account</h2>
        <button
          type="button"
          className="close-btn"
          aria-label="Close"
          onClick={() => (window.location.href = "/")}
        >
          &times;
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="checkbox-group">
          <label htmlFor="terms">
            <input
              id="terms"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              I agree to the <a href="#">Terms &amp; Conditions</a> and confirm I am over 18.
            </span>
          </label>
        </div>

        <button type="submit" className="auth-btn">Open Account</button>

        <div className="auth-footer">
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
            Already have an account? Sign In
          </a>
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
