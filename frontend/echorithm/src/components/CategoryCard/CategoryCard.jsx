import React from "react";
import "./CategoryCard.css";
import { CATEGORIES } from "../../constants/categories";

const getGradient = (category) => {
  const gradients = {
    Technology: "linear-gradient(135deg, #007cf0, #00dfd8)",
    Science: "linear-gradient(135deg, #667eea, #764ba2)",
    Health: "linear-gradient(135deg, #56ab2f, #a8e063)",
    General: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    Travel: "linear-gradient(135deg, #43cea2, #185a9d)",
    Entertainment: "linear-gradient(135deg, #f7971e, #ffd200)",
    Sports: "linear-gradient(135deg, #4facfe, #00f2fe)",
    Business: "linear-gradient(135deg, #614385, #516395)",
    Politics: "linear-gradient(135deg, #ff6a00, #ee0979)",
    Environment: "linear-gradient(135deg, #11998e, #38ef7d)",
  };
  return gradients[category] || "linear-gradient(135deg, #bdc3c7, #2c3e50)";
};

const CategoryCard = ({ category, onClick }) => {
  return (
    <button
      className="category-card"
      style={{ background: getGradient(category) }}
      onClick={() => onClick(category)}
      aria-label={`View ${category} news`}
    >
      <span className="category-card__text">{category}</span>
    </button>
  );
};

export const CategoryGrid = ({ onCategoryClick }) => {
  return (
    <section
      className="category-grid"
      role="region"
      aria-label="News categories"
    >
      {CATEGORIES.map((cat) => (
        <CategoryCard key={cat} category={cat} onClick={onCategoryClick} />
      ))}
    </section>
  );
};
