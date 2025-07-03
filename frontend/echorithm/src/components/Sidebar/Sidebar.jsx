import React from "react";
import "./Sidebar.css";
import { CATEGORIES } from "../../constants/categories";

const Sidebar = () => {
  const handleClick = (cat) => {
    console.log("Clicked category:", cat);
    // Optional: scroll to section, filter news, or update state
  };

  return (
    <aside className="sidebar" aria-label="News Categories">
      <h2 className="sidebar__title">Categories</h2>
      <ul className="sidebar__list">
        {CATEGORIES.map((cat) => (
          <li key={cat} className="sidebar__item">
            <button
              className="sidebar__button"
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
