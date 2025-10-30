import React from "react";
import "./NewsCard.css";
import { formatDate } from "../../utils/formatDate";

const NewsCard = ({ 
  title, 
  image, 
  source, 
  date, 
  author, 
  summary, 
  link,
  category,
  sentiment_label,
  sentiment_confidence,
  entities
}) => {
  return (
    <article className="news-card" role="article">
      {/* Sentiment Badge - Top Right Corner */}
      {sentiment_label && (
        <div className={`sentiment-sticker sentiment-sticker--${sentiment_label.toLowerCase()}`}>
          <span className="sentiment-sticker__emoji">
            {sentiment_label.toLowerCase() === 'positive' ? '😊' : 
             sentiment_label.toLowerCase() === 'negative' ? '😔' : '😐'}
          </span>
          <span className="sentiment-sticker__label">{sentiment_label}</span>
        </div>
      )}

      <div className="news-card__header">
        <div className="news-card__source">
          <span className="news-card__source-logo">📰</span>
          <span className="news-card__source-name">{source}</span>
        </div>
        <span className="news-card__date">{formatDate(date)}</span>
      </div>

      <h2 className="news-card__title">{title}</h2>

      {/* Category and Entities - Compact Row */}
      <div className="news-card__meta-row">
        {category && (
          <span className="category-tag">🏷️ {category}</span>
        )}
        {entities && entities.length > 0 && (
          <div className="entities-compact">
            {entities.slice(0, 3).map((entity, index) => (
              <span key={index} className="entity-chip">{entity}</span>
            ))}
            {entities.length > 3 && (
              <span className="entity-chip entity-chip--more">+{entities.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {image && (
        <img
          src={image}
          alt={title}
          className="news-card__image"
          loading="lazy"
        />
      )}

      {/* Summary - Only if exists */}
      {summary && (
        <div className="news-card__summary">
          <span className="summary-icon">🤖</span>
          <p className="summary-text">{summary}</p>
        </div>
      )}

      <div className="news-card__footer">
        {author && <span className="news-card__author">By {author}</span>}
        <a href={link || "#"} className="news-card__read-more" target="_blank" rel="noopener noreferrer">
          Read Full Article →
        </a>
      </div>
    </article>
  );
};

export default NewsCard;

