import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <p className="footer__text">© {new Date().getFullYear()} Echorithm. All rights reserved.</p>
        <ul className="footer__links">
          <li><a href="#privacy">Privacy</a></li>
          <li><a href="#terms">Terms</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
