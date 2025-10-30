import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSearchSuggestions } from '../../services/api';
import './SearchBar.css';

const SearchBar = ({ initialQuery = '', placeholder = 'Search news...', onSearch }) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState({ recent: [], popular: [] });
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    // Load search suggestions
    const loadSuggestions = async () => {
      try {
        const data = await fetchSearchSuggestions(5);
        setSuggestions({
          recent: data.recent_searches || [],
          popular: data.popular_searches || []
        });
      } catch (error) {
        console.error('Failed to load suggestions:', error);
      }
    };

    if (showSuggestions) {
      loadSuggestions();
    }
  }, [showSuggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    }
  };

  const handleInputFocus = () => {
    if (localStorage.getItem('access')) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-bar-form">
        <div className="search-input-wrapper">
          <svg 
            className="search-icon" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            width="20" 
            height="20"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <button type="submit" className="search-submit-btn">
          Search
        </button>
      </form>

      {showSuggestions && (suggestions.recent.length > 0 || suggestions.popular.length > 0) && (
        <div className="search-suggestions">
          {suggestions.recent.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-header">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                </svg>
                Recent Searches
              </div>
              {suggestions.recent.map((suggestion, index) => (
                <div
                  key={`recent-${index}`}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}

          {suggestions.popular.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-header">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                Popular Searches
              </div>
              {suggestions.popular.map((item, index) => (
                <div
                  key={`popular-${index}`}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item.query)}
                >
                  <span>{item.query}</span>
                  <span className="suggestion-count">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
