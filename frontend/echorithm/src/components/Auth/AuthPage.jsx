import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthPage.css"; // Use your existing CSS here

const AuthPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleToggle = () => {
        setIsRegistering((prev) => !prev);
    };

    return (
        <div className="form-container">
        {/* Left Side - Banner */}
        <div className="banner-column">
            <div>
            <h1 className="mycolor1">{isRegistering ? "REGISTER" : "LOGIN"}</h1>
            <h3>Hi! there</h3>
            <h4>Glad to see you</h4>
            <p>
                This is a SWE FINAL group project on news Aggregator. Team members
                are FAHIM, MISKAT, SHIHAB. Our Course instructor is Mohammad
                Arfizurrahman. He is a very student-friendly and kind-hearted
                person.
            </p>
            </div>
            <div>
            <p>www.KING-ARFIZ.COM</p>
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="inner-form">
            {isRegistering ? (
            <RegisterForm onSwitch={handleToggle} />
            ) : (
            <LoginForm onSwitch={handleToggle} />
            )}
        </div>
        </div>
    );
};

export default AuthPage;
