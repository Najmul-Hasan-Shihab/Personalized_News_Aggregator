import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ onSwitch }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
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
                headers: {
                    "Content-Type": "application/json"
                }
            });
            alert("✅ Registration successful!");
            onSwitch(); // Navigate to login form
        } catch (err) {
            console.error("Registration failed:", err);
            setError("❌ Something went wrong. Try again.");
        }
    };

    return (
        <>
            <h2>Register_</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        id="username"
                        placeholder="USERNAME"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        id="password"
                        placeholder="PASSWORD"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                    />
                    <label htmlFor="terms">
                        By clicking you agree to our{" "}
                        <a href="#">terms & conditions</a> and confirm that you are over 18.
                    </label>
                </div>

                <div className="form-footer">
                    <a href="#" onClick={onSwitch}>
                        Already have an account? Sign In
                    </a>
                    <button
                        type="submit"
                        className="mycolor"
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            color: "white",
                            cursor: "pointer"
                        }}
                    >
                        OPEN ACCOUNT
                    </button>
                </div>

                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            </form>
        </>
    );
};

export default RegisterForm;