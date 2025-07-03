import React from "react";
import "./NewsCard.css";
import { formatDate } from "../../utils/formatDate";

const NewsCard = ({ title, image, source, date, author }) => {
  return (
    <article className="news-card" role="article">
      <div className="news-card__header">
        <div className="news-card__source">
          <span className="news-card__source-logo">📰</span>
          <span className="news-card__source-name">{source}</span>
        </div>
        <span className="news-card__date">{formatDate(date)}</span>
      </div>

      <h2 className="news-card__title">{title}</h2>

      <p className="news-card__summary">
        🤖 <strong>AI Summary:</strong> A groundbreaking discovery in renewable energy shows promise for global sustainability. Experts say the breakthrough could reshape global energy strategies and reduce dependency on fossil fuels.
      </p>

      <img
        src={image || "https://via.placeholder.com/600x300?text=News+Image"}
        alt={title}
        className="news-card__image"
      />

      <div className="news-card__footer">
        <span className="news-card__author">By {author}</span>
        <a href="/news/123" className="news-card__read-more">
          Read More →
        </a>
      </div>
    </article>
  );
};

export default NewsCard;
