import React, { useState } from "react";
import { Link } from "react-router-dom"; // Add this at the top
import "./Header.css";
import { LogIn, UserPlus } from "lucide-react";
import Profile from "../profile/Profile";

const Header = () => {
  const [showProfile, setShowProfile] = useState(false); // 👈 Toggle profile visibility

  const user = {
    name: "John Doe",
    profilePic: "https://via.placeholder.com/40", // Replace with actual user profile picture URL
  };

  return (
    <>
      <header className="header" role="banner">
        <div className="header__container">
          <div className="header__logo" aria-label="Echorithm Home">
            <a href="/">🧠 <span>Echorithm</span></a>
          </div>

          <nav className="header__nav" aria-label="Main Navigation">
            <ul className="header__nav-list">
              <li><Link to="/home">Home</Link></li>
              <li>
                <Link to="/foryou">For You</Link>
              </li>

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
              <button className="btn btn--outline">
                <LogIn size={16} style={{ marginRight: "6px" }} />
                Login
              </button>
              <button className="btn btn--filled">
                <UserPlus size={16} style={{ marginRight: "6px" }} />
                Sign Up
              </button>
            </div>

            <Link to="/profile" className="header__profile" title={user.name}>
              <img
                src={user.profilePic}
                alt="Profile"
                className="header__profile-img"
              />
            </Link>
          </div>
        </div>
      </header>

      {showProfile && <Profile />} {/* 👈 Conditionally render profile section */}
    </>
  );
};

export default Header;
