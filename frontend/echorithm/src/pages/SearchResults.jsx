import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchArticles, trackSearchQuery } from '../services/api';
import NewsCard from '../components/NewsCard/NewsCard';
import Sidebar from '../components/Sidebar/Sidebar';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(20);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sentiment: searchParams.get('sentiment') || '',
    date_from: searchParams.get('date_from') || '',
    date_to: searchParams.get('date_to') || '',
    sort: searchParams.get('sort') || 'relevance',
  });

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await searchArticles(query, {
        ...filters,
        limit: 100
      });

      setArticles(data.results || []);

      // Track search query
      await trackSearchQuery(query, data.count || 0);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search articles. Please try again.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    const newCategory = category === 'All' ? '' : category;
    handleFilterChange('category', newCategory);
    setDisplayCount(20);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = { q: query };
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) params[key] = newFilters[key];
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      sentiment: '',
      date_from: '',
      date_to: '',
      sort: 'relevance'
    };
    setFilters(resetFilters);
    setSearchParams({ q: query });
  };

  const loadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  const hasActiveFilters = filters.category || filters.sentiment || filters.date_from || filters.date_to;

  return (
    <main className="search-results-page">
      {/* Left Sidebar - Same as Home */}
      <aside className="search-results__sidebar">
        <Sidebar onCategoryClick={handleCategoryClick} />
      </aside>

      {/* Main Content */}
      <section className="search-results__main-content">
        {/* Search Header with Query Info */}
        <div className="search-header-info">
          <h1 className="search-title">
            Search Results for: <span className="search-query">"{query}"</span>
          </h1>
          <p className="search-meta">
            Found <strong>{articles.length}</strong> articles
            {hasActiveFilters && <span> (filtered)</span>}
          </p>
        </div>

        {/* Additional Filters Row */}
        <div className="search-filters-row">
          <div className="filter-group-inline">
            <label>Sort:</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="date">Most Recent</option>
            </select>
          </div>

          <div className="filter-group-inline">
            <label>Sentiment:</label>
            <select
              value={filters.sentiment}
              onChange={(e) => handleFilterChange('sentiment', e.target.value)}
            >
              <option value="">All</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div className="filter-group-inline">
            <label>From:</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
            />
          </div>

          <div className="filter-group-inline">
            <label>To:</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Searching articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={performSearch}>Retry</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && query && (
          <div className="empty-state">
            <h2>No results found</h2>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Results Grid - Same as Home */}
        {!loading && !error && articles.length > 0 && (
          <>
            <div className="search-results__news-grid">
              {articles.slice(0, displayCount).map((article, index) => (
                <NewsCard
                  key={index}
                  article={article}
                />
              ))}
            </div>

            {/* Load More Button */}
            {displayCount < articles.length && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={loadMore}>
                  Load More Articles
                </button>
                <p className="load-more-info">
                  Showing {displayCount} of {articles.length} articles
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default SearchResults;
