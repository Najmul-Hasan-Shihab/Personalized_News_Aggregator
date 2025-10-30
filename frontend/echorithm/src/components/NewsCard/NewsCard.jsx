import React from "react";
import "./NewsCard.css";
import { formatDate } from "../../utils/formatDate";
import { trackArticleView } from "../../services/api";

const NewsCard = ({ 
  article,  // Can receive full article object
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
  // Handle both article object and individual props
  const articleData = article || {
    title,
    urlToImage: image,
    source,
    publishedAt: date,
    author,
    summary,
    url: link,
    category,
    sentiment_label,
    sentiment_confidence,
    entities
  };

  const handleArticleClick = async () => {
    // Track article view for ML recommendations
    try {
      await trackArticleView({
        article_url: articleData.url,  // Changed from 'url' to 'article_url'
        article_title: articleData.title,  // Changed from 'title' to 'article_title'
        category: articleData.category,
        reading_time: 0, // Can be enhanced with actual reading time tracking
      });
    } catch (error) {
      // Silently fail - tracking shouldn't break UX
      console.error("Failed to track article view:", error);
    }
  };

  return (
    <article className="news-card" role="article">
      {/* Sentiment Badge - Top Right Corner */}
      {articleData.sentiment_label && (
        <div className={`sentiment-sticker sentiment-sticker--${articleData.sentiment_label.toLowerCase()}`}>
          <span className="sentiment-sticker__emoji">
            {articleData.sentiment_label.toLowerCase() === 'positive' ? '😊' : 
             articleData.sentiment_label.toLowerCase() === 'negative' ? '😔' : '😐'}
          </span>
          <span className="sentiment-sticker__label">{articleData.sentiment_label}</span>
        </div>
      )}

      <div className="news-card__header">
        <div className="news-card__source">
          <span className="news-card__source-logo">📰</span>
          <span className="news-card__source-name">{articleData.source}</span>
        </div>
        <span className="news-card__date">{formatDate(articleData.publishedAt || articleData.date)}</span>
      </div>

      <h2 className="news-card__title">{articleData.title}</h2>

      {/* Category and Entities - Compact Row */}
      <div className="news-card__meta-row">
        {articleData.category && (
          <span className="category-tag">🏷️ {articleData.category}</span>
        )}
        {articleData.entities && articleData.entities.length > 0 && (
          <div className="entities-compact">
            {articleData.entities.slice(0, 3).map((entity, index) => (
              <span key={index} className="entity-chip">{entity}</span>
            ))}
            {articleData.entities.length > 3 && (
              <span className="entity-chip entity-chip--more">+{articleData.entities.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {articleData.urlToImage && (
        <img
          src={articleData.urlToImage}
          alt={articleData.title}
          className="news-card__image"
          loading="lazy"
        />
      )}

      {/* Summary - Only if exists */}
      {articleData.summary && (
        <div className="news-card__summary">
          <span className="summary-icon">🤖</span>
          <p className="summary-text">{articleData.summary}</p>
        </div>
      )}

      <div className="news-card__footer">
        {articleData.author && <span className="news-card__author">By {articleData.author}</span>}
        <a 
          href={articleData.url || "#"} 
          className="news-card__read-more" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleArticleClick}
        >
          Read Full Article →
        </a>
      </div>
    </article>
  );
};

export default NewsCard;

