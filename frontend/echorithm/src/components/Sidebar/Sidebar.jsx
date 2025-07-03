import React from "react";
import "./Sidebar.css";
import { CATEGORIES } from "../../constants/categories";

const Sidebar = () => {
  return (
    <aside className="sidebar" aria-label="News Categories">
      <h2 className="sidebar__title">Categories</h2>
      <ul className="sidebar__list">
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <a href={`#${cat.toLowerCase()}`} className="sidebar__link">
              {cat}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
