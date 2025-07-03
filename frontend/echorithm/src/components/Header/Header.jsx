import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header" role="banner">
      <div className="header__logo">Echorithm</div>

      <nav className="header__nav" aria-label="Primary Navigation">
        <ul className="header__nav-list">
          <li><a href="#home">Home</a></li>
          <li><a href="#foryou">For You</a></li>
          <li><a href="#following">Following</a></li>
        </ul>
      </nav>

      <div className="header__actions">
        <input
          type="search"
          placeholder="Search news..."
          aria-label="Search"
          className="header__search"
        />
        <button className="header__login">Login</button>
        <button className="header__signup">Signup</button>
      </div>
    </header>
  );
};

export default Header;
