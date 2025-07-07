import React, { useState } from "react";
import axios from "axios";

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
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Login_</h2>
                <div
                    className="circle2"
                    onClick={() => (window.location.href = "/")}
                    style={{
                        backgroundColor: "#FB758F",
                        color: "white",
                        cursor: "pointer",
                        textAlign: "center",
                        lineHeight: "60px",
                        fontSize: "30px",
                    }}
                >
                    &times;
                </div>
            </div>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="USERNAME"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="forgot-password-link">
                    <a href="#" onClick={() => alert("Password reset coming soon!")}>
                        Forget password?
                    </a>
                </div>

                <div className="form-footer">
                    <a href="#" onClick={onSwitch}>
                        New user?
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
                        SIGN IN
                    </button>
                </div>

                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            </form>

            <hr style={{ margin: "20px 0" }} />
            <button className="google-btn" onClick={() => alert("Google login coming soon!")}>
                <i className="fab fa-google"></i> Sign in using Google
            </button>
        </>
    );
};

export default LoginForm;