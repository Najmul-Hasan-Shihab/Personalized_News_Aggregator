import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";
import { LogIn, UserPlus } from "lucide-react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const backendURL = "http://localhost:8000"; // or use env variable

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    const fetchUserInfo = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${backendURL}/user/info/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  const profileImageUrl = userInfo?.profilePic
    ? `${backendURL}${userInfo.profilePic}`
    : "https://via.placeholder.com/40";

  return (
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
                <Link to="/profile" className="header__profile" title={userInfo?.name || "Profile"}>
                  <img
                    src={profileImageUrl}
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
  );
};

export default Header;