import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard/NewsCard';
import { fetchBookmarks } from '../services/api';
import './Bookmarks.css';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'category'
  const [filterCategory, setFilterCategory] = useState('all');
  
  const categories = ['all', 'Technology', 'Business', 'Sports', 'Entertainment', 'Health', 'Science', 'Politics'];

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBookmarks();
      setBookmarks(data.bookmarks || []);
    } catch (err) {
      console.error('Error loading bookmarks:', err);
      setError('Failed to load bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkRemoved = (articleUrl) => {
    // Remove bookmark from local state after NewsCard removes it
    setBookmarks(prev => prev.filter(b => b.article_url !== articleUrl));
  };

  // Filter bookmarks by category
  const filteredBookmarks = filterCategory === 'all' 
    ? bookmarks 
    : bookmarks.filter(b => b.category === filterCategory);

  // Sort bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at) - new Date(a.created_at); // Newest first
    } else if (sortBy === 'category') {
      return (a.category || '').localeCompare(b.category || '');
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="bookmarks-page">
        <div className="bookmarks-header">
          <h1 className="bookmarks-title">📚 Your Bookmarks</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your saved articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookmarks-page">
        <div className="bookmarks-header">
          <h1 className="bookmarks-title">📚 Your Bookmarks</h1>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={loadBookmarks}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-header">
        <div className="header-content">
          <h1 className="bookmarks-title">📚 Your Bookmarks</h1>
          <p className="bookmarks-subtitle">
            {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'} saved
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div className="bookmarks-controls">
            <div className="control-group">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date Added</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="category-filter">Category:</label>
              <select 
                id="category-filter"
                className="category-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {sortedBookmarks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔖</div>
          <h2>
            {filterCategory === 'all' 
              ? 'No bookmarks yet' 
              : `No bookmarks in ${filterCategory}`}
          </h2>
          <p>
            {filterCategory === 'all'
              ? 'Start saving articles by clicking the bookmark button on any news card!'
              : 'Try selecting a different category or view all bookmarks.'}
          </p>
          {filterCategory !== 'all' && (
            <button 
              className="reset-filter-btn"
              onClick={() => setFilterCategory('all')}
            >
              View All Bookmarks
            </button>
          )}
        </div>
      ) : (
        <div className="bookmarks-grid">
          {sortedBookmarks.map((bookmark) => (
            <NewsCard
              key={bookmark.article_url}
              article={{
                title: bookmark.title,
                summary: bookmark.summary,
                url: bookmark.article_url,
                source: bookmark.source,
                author: bookmark.author,
                image_url: bookmark.image_url,
                published_at: bookmark.published_at,
                category: bookmark.category,
                sentiment: bookmark.sentiment,
              }}
              onBookmarkChange={() => handleBookmarkRemoved(bookmark.article_url)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
