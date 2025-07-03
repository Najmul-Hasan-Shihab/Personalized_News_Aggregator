import React from "react";
import "./Sidebar.css";
import { CATEGORIES } from "../../constants/categories";

// Gradient map for each category
const getGradient = (category) => {
  const gradients = {
    Health: "linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    Science: "linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    Space: "linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    World: "linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    Local:"linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    Business:"linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    International: "linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    Technology: "linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    Sports:"linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    Bangladesh: "linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    Asia: "linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
    Cricket: "linear-gradient(135deg, #667eea,rgb(223, 207, 240))",
  };

  return gradients[category] ||"linear-gradient(135deg, #667eea,rgb(223, 207, 240))";
};

const Sidebar = () => {
  const handleClick = (cat) => {
    console.log("Clicked category:", cat);
    // You can scroll to section or filter news
  };

  return (
    <aside className="sidebar" aria-label="News Categories">
      <h2 className="sidebar__title">Categories</h2>
      <ul className="sidebar__list">
        {CATEGORIES.map((cat) => (
          <li key={cat} className="sidebar__item">
            <button
              className="sidebar__button"
              style={{ background: getGradient(cat) }}
              onClick={() => handleClick(cat)}
              aria-label={`Go to ${cat}`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
