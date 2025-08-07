import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";
import { LogIn, UserPlus } from "lucide-react";
import Profile from "../profile/Profile";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const user = {
    name: "John Doe",
    profilePic: "https://via.placeholder.com/40", // Replace with real user image
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  return (
    <>
      <header className="header" role="banner">
        <div className="header__container">
          <div className="header__logo" aria-label="Echorithm Home">
            <Link to="/">🧠 <span>Echorithm</span></Link>
          </div>

          <nav className="header__nav" aria-label="Main Navigation">
            <ul className="header__nav-list">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/foryou">For You</Link></li>
              <li><Link to="/following">Following</Link></li>
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
                <>
                  <button className="btn btn--outline" onClick={handleLogout}>
                    Logout
                  </button>
                  <Link to="/profile" className="header__profile" title={user.name}>
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="header__profile-img"
                    />
                  </Link>
                </>
              ) : (
                <>
                  <button className="btn btn--outline" onClick={() => navigate("/auth")}>
                    <LogIn size={16} style={{ marginRight: "6px" }} />
                    Login
                  </button>
                  <button className="btn btn--filled" onClick={() => navigate("/auth")}>
                    <UserPlus size={16} style={{ marginRight: "6px" }} />
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {showProfile && <Profile />}
    </>
  );
};

export default Header;
