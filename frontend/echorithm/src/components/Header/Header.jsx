import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header" role="banner">
      <div className="header__container">
        <div className="header__logo" aria-label="Echorithm Home">
          <a href="/">🧠 <span>Echorithm</span></a>
        </div>

        <nav className="header__nav" aria-label="Main Navigation">
          <ul className="header__nav-list">
            <li><a href="#home">Home</a></li>
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
            <button className="btn btn--outline">Login</button>
            <button className="btn btn--filled">Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
