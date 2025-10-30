import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";
import { LogIn, UserPlus } from "lucide-react";
import Profile from "../profile/Profile";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    profilePic: "https://via.placeholder.com/40",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);

    // Load user profile from localStorage
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile({
          name: profile.name || "John Doe",
          profilePic: profile.profilePic || "https://via.placeholder.com/40",
        });
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    }

    // Listen for storage changes (when profile is updated)
    const handleStorageChange = () => {
      const updatedProfile = localStorage.getItem("userProfile");
      if (updatedProfile) {
        try {
          const profile = JSON.parse(updatedProfile);
          setUserProfile({
            name: profile.name || "John Doe",
            profilePic: profile.profilePic || "https://via.placeholder.com/40",
          });
        } catch (error) {
          console.error("Error updating user profile:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for same-tab updates
    window.addEventListener("profileUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
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
            <form 
              className="header__search-form" 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  setSearchQuery("");
                }
              }}
            >
              <input
                type="search"
                className="header__search"
                placeholder="Search news..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="header__buttons">
              {isLoggedIn ? (
                <>
                  <button className="btn btn--outline" onClick={handleLogout}>
                    Logout
                  </button>
                  <Link to="/profile" className="header__profile" title={userProfile.name}>
                    <img
                      src={userProfile.profilePic}
                      alt="Profile"
                      className="header__profile-img"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  </Link>
                </>
              ) : (
                <>
                  <button className="btn btn--outline" onClick={() => navigate("/auth?mode=login")}>
                    <LogIn size={16} style={{ marginRight: "6px" }} />
                    Login
                  </button>
                  <button className="btn btn--filled" onClick={() => navigate("/auth?mode=signup")}>
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
