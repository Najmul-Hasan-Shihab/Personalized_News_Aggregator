import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // If you're using react-router
import "./Header.css";


const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate("/auth"); // or navigate to login page
  };

  return (
    <header className="header" role="banner">
      <div className="header__container">
        <div className="header__logo" aria-label="Echorithm Home">
          <a href="/">🧠 <span>Echorithm</span></a>
        </div>

        <nav className="header__nav" aria-label="Main Navigation">
          <ul className="header__nav-list">
            <li><a href="/">Home</a></li>
            <li><a href="#foryou">For You</a></li>
            <li><a href="#following">Following</a></li>
          </ul>
        </nav>

        <div className="header__right">
          <input
            type="search"
            className="header__search"
            placeholder="Search news..."
            aria-label="Search"
          />
          <div className="header__buttons">
            {isLoggedIn ? (
              <button className="btn btn--outline" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <button className="btn btn--outline" onClick={() => navigate("/auth")}>
                  Login
                </button>
                <button className="btn btn--filled" onClick={() => navigate("/auth")}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
