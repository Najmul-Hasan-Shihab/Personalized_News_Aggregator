import React from "react";
import "./NewsCard.css";
import { formatDate } from "../../utils/formatDate";

const sentimentColors = {
  Positive: "#4CAF50",
  Neutral: "#9E9E9E",
  Negative: "#F44336",
};

const NewsCard = ({
  title,
  image,
  source,
  date,
  author,
  summary,
  link,
  sentiment_label,
  sentiment_confidence,
  entities = []
}) => {
  return (
    <article className="news-card" role="article">
      {/* Header */}
      <div className="news-card__header">
        <div className="news-card__source">
          <span className="news-card__source-logo">📰</span>
          <span className="news-card__source-name">{source}</span>
        </div>
        <span className="news-card__date">{formatDate(date)}</span>
      </div>

      {/* Title */}
      <h2 className="news-card__title">{title}</h2>

      {/* Sentiment Badge */}
      {sentiment_label && (
        <div
          className="news-card__sentiment"
          style={{ backgroundColor: sentimentColors[sentiment_label] || "#ccc" }}
          title={`Confidence: ${(sentiment_confidence * 100).toFixed(1)}%`}
        >
          {sentiment_label}
        </div>
      )}

      {/* Summary */}
      <p className="news-card__summary">
        🤖 <strong>Summary:</strong> {summary || "No summary available."}
      </p>

      {/* Image */}
      <img
        src={image || "https://via.placeholder.com/600x300?text=News+Image"}
        alt={title}
        className="news-card__image"
      />

      {/* Entities */}
      {entities.length > 0 && (
        <div className="news-card__entities">
          {entities.map((entity, i) => (
            <span key={i} className="news-card__entity-chip" title={`Entity: ${entity}`}>
              {entity}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="news-card__footer">
        <span className="news-card__author">✍ {author || "Unknown"}</span>
        <a
          href={link || "#"}
          className="news-card__read-more"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read More →
        </a>
      </div>
    </article>
  );
};

export default NewsCard;
