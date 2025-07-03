import React from "react";
import "./NewsCard.css";
import { formatDate } from "../../utils/formatDate";

const NewsCard = ({ title, image, source, date, author }) => {
  return (
    <article className="news-card" role="article">
      <div className="news-card__left">
        <div className="news-card__source">
          <span className="news-card__source-logo">📰</span>
          <span className="news-card__source-name">{source}</span>
        </div>
        <h2 className="news-card__title">{title}</h2>
        <p className="news-card__meta">
          {formatDate(date)} • <span className="news-card__author">{author}</span>
        </p>
      </div>

      <div className="news-card__right">
        <img src={image} alt={title} className="news-card__image" />
        <button className="news-card__menu" aria-label="More options">⋮</button>
      </div>
    </article>
  );
};

export default NewsCard;
