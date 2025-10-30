import React, { useState, useEffect } from "react";
import "./NewsCard.css";
import { formatDate } from "../../utils/formatDate";
import { trackArticleView, addBookmark, removeBookmark, checkBookmarkStatus, trackReadingSession } from "../../services/api";

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
  entities,
  onBookmarkChange  // Callback when bookmark state changes
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [readingStartTime, setReadingStartTime] = useState(null);
  const [currentReadingTime, setCurrentReadingTime] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loadingCheckDone, setLoadingCheckDone] = useState(false); // Prevent re-checking

  // Update reading time every second when modal is open
  useEffect(() => {
    let interval;
    if (showReaderModal && readingStartTime) {
      interval = setInterval(() => {
        setCurrentReadingTime(Math.floor((Date.now() - readingStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showReaderModal, readingStartTime]);

  // Handle both article object and individual props
  const articleData = article ? {
    title: article.title,
    urlToImage: article.image_url || article.urlToImage,
    source: article.source,
    publishedAt: article.published_at || article.publishedAt,
    author: article.author,
    summary: article.summary,
    url: article.url || article.article_url,
    category: article.category,
    sentiment_label: article.sentiment || article.sentiment_label,
    sentiment_confidence: article.sentiment_confidence,
    entities: article.entities
  } : {
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

  // Check bookmark status on mount
  useEffect(() => {
    const checkBookmark = async () => {
      if (!localStorage.getItem('access') || !articleData.url) return;
      
      try {
        const result = await checkBookmarkStatus([articleData.url]);
        setIsBookmarked(result.bookmarks[articleData.url] || false);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };
    
    checkBookmark();
  }, [articleData.url]);

  const handleArticleClick = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    
    const startTime = Date.now();
    setReadingStartTime(startTime);
    
    // Track article view for ML recommendations
    try {
      await trackArticleView({
        article_url: articleData.url,
        article_title: articleData.title,
        category: articleData.category,
        reading_time: 0,
      });
    } catch (error) {
      console.error("Failed to track article view:", error);
    }

    // Track reading session for analytics (only if user is logged in)
    if (localStorage.getItem('access')) {
      try {
        // Generate a unique session ID
        const newSessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        
        console.log('📊 Tracking reading session:', {
          article_title: articleData.title,
          category: articleData.category,
          hour: new Date().getHours(),
          day: new Date().toLocaleDateString('en-US', { weekday: 'long' })
        });
        
        // Track the reading session start
        await trackReadingSession({
          session_id: newSessionId,
          article_url: articleData.url,
          article_title: articleData.title,
          category: articleData.category || 'Uncategorized',
          reading_time: 0,
          completed: false,
          timestamp: new Date().toISOString(),
        });
        
        console.log('✅ Reading session tracked successfully');
      } catch (error) {
        console.error("Failed to track reading session:", error);
      }
    }
    
    // Open reader modal
    setShowReaderModal(true);
  };

  const handleCloseReader = async () => {
    // Calculate reading time
    if (readingStartTime && sessionId && localStorage.getItem('access')) {
      const readingTime = Math.floor((Date.now() - readingStartTime) / 1000); // in seconds
      
      console.log(`📖 User read for ${readingTime} seconds`);
      
      try {
        // Update the session with actual reading time
        await trackReadingSession({
          session_id: sessionId,
          article_url: articleData.url,
          article_title: articleData.title,
          category: articleData.category || 'Uncategorized',
          reading_time: readingTime,
          completed: readingTime > 30, // Consider completed if read for more than 30 seconds
          timestamp: new Date().toISOString(),
        });
        
        console.log('✅ Reading time updated successfully');
      } catch (error) {
        console.error("Failed to update reading time:", error);
      }
    }
    
    setShowReaderModal(false);
    setSessionId(null);
    setReadingStartTime(null);
    setIframeError(false);
    setIframeLoaded(false);
    setLoadingCheckDone(false);
    setCurrentReadingTime(0);
  };

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!localStorage.getItem('access')) {
      alert('Please login to bookmark articles');
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(articleData.url);
        setIsBookmarked(false);
        // Call callback if provided (used in Bookmarks page)
        if (onBookmarkChange) {
          onBookmarkChange(articleData.url);
        }
      } else {
        await addBookmark(articleData);
        setIsBookmarked(true);
        // Call callback if provided
        if (onBookmarkChange) {
          onBookmarkChange(articleData.url);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      alert(error.response?.data?.message || 'Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
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
          
          {/* Bookmark Button - After Source Name */}
          <button 
            className={`bookmark-btn-inline ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmarkToggle}
            disabled={bookmarkLoading}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            {bookmarkLoading ? (
              <span className="bookmark-loading">⏳</span>
            ) : (
              <span className="bookmark-icon">{isBookmarked ? '🔖' : '📑'}</span>
            )}
          </button>
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
            {articleData.entities.map((entity, index) => (
              <span key={index} className="entity-chip">{entity}</span>
            ))}
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
        <button 
          className="news-card__read-more" 
          onClick={handleArticleClick}
        >
          Read Full Article →
        </button>
      </div>

      {/* Reading Modal */}
      {showReaderModal && (
        <div className="reader-modal-overlay" onClick={handleCloseReader}>
          <div className="reader-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reader-modal-header">
              <h3 className="reader-modal-title">{articleData.title}</h3>
              <button className="reader-modal-close" onClick={handleCloseReader}>
                ✕
              </button>
            </div>
            <div className="reader-modal-body">
              {iframeError ? (
                <div className="iframe-error-message">
                  <div className="error-icon">🔒</div>
                  <h3>Content Restriction</h3>
                  <p>This website doesn't allow embedding for security reasons.</p>
                  <p className="error-subtext">The article has been opened in a new tab. Your reading time is still being tracked!</p>
                  <button className="error-close-btn" onClick={handleCloseReader}>
                    Close & Save Reading Time
                  </button>
                </div>
              ) : (
                <>
                  <iframe
                    src={articleData.url}
                    title={articleData.title}
                    className="reader-iframe"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    onLoad={(e) => {
                      // Only check once to prevent flickering
                      if (loadingCheckDone) return;
                      setLoadingCheckDone(true);
                      
                      // Check if iframe loaded successfully or got blocked
                      try {
                        const iframeDoc = e.target.contentDocument || e.target.contentWindow.document;
                        if (!iframeDoc || iframeDoc.location.href === 'about:blank') {
                          // Iframe blocked - show error and open in new tab
                          setIframeError(true);
                          window.open(articleData.url, '_blank');
                        } else {
                          // Successfully loaded
                          setIframeLoaded(true);
                        }
                      } catch (error) {
                        // Cross-origin error means iframe loaded but we can't access it (which is fine)
                        setIframeLoaded(true);
                        console.log('Iframe loaded (cross-origin protection active)');
                      }
                    }}
                    onError={() => {
                      // Handle iframe loading errors (CSP, X-Frame-Options, etc.)
                      if (!loadingCheckDone) {
                        setLoadingCheckDone(true);
                        setIframeError(true);
                        window.open(articleData.url, '_blank');
                      }
                    }}
                  />
                  {!loadingCheckDone && (
                    <div className="iframe-loading-overlay">
                      <div className="loading-spinner-large"></div>
                      <p>Loading article...</p>
                      <button 
                        className="skip-loading-btn"
                        onClick={() => {
                          setLoadingCheckDone(true);
                          setIframeError(true);
                          window.open(articleData.url, '_blank');
                        }}
                      >
                        Can't see the article? Open in new tab instead
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="reader-modal-footer">
              <span className="reading-timer">
                ⏱️ Reading time: {Math.floor(currentReadingTime / 60)}m {currentReadingTime % 60}s
              </span>
              <button className="open-external-btn" onClick={() => window.open(articleData.url, '_blank')}>
                Open in New Tab ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default NewsCard;

