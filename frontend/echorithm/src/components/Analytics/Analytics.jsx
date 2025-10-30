import React, { useState, useEffect } from 'react';
import {
  fetchReadingStats,
  fetchReadingTimeline,
  fetchPeakReadingTimes,
  fetchPersonalizedInsights
} from '../../services/api';
import './Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [peakTimes, setPeakTimes] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(30); // 7, 30, or 90 days

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, timelineData, peakData, insightsData] = await Promise.all([
        fetchReadingStats(timeRange),
        fetchReadingTimeline(timeRange),
        fetchPeakReadingTimes(timeRange),
        fetchPersonalizedInsights(timeRange)
      ]);

      setStats(statsData);
      setTimeline(timelineData.timeline || []);
      setPeakTimes(peakData);
      setInsights(insightsData.insights || []);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your reading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={loadAnalytics}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Header with Time Range Selector */}
      <div className="analytics-header">
        <h2 className="analytics-title">📊 Reading Analytics</h2>
        <div className="time-range-selector">
          <button
            className={`range-btn ${timeRange === 7 ? 'active' : ''}`}
            onClick={() => setTimeRange(7)}
          >
            7 Days
          </button>
          <button
            className={`range-btn ${timeRange === 30 ? 'active' : ''}`}
            onClick={() => setTimeRange(30)}
          >
            30 Days
          </button>
          <button
            className={`range-btn ${timeRange === 90 ? 'active' : ''}`}
            onClick={() => setTimeRange(90)}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      {stats && (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📚</div>
            <div className="metric-content">
              <h3 className="metric-value">{stats.total_articles_read}</h3>
              <p className="metric-label">Articles Read</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <h3 className="metric-value">{stats.total_reading_time_formatted}</h3>
              <p className="metric-label">Total Reading Time</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⌛</div>
            <div className="metric-content">
              <h3 className="metric-value">{stats.average_reading_time_formatted}</h3>
              <p className="metric-label">Avg. Reading Time</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">✅</div>
            <div className="metric-content">
              <h3 className="metric-value">{stats.completion_rate}%</h3>
              <p className="metric-label">Completion Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Insights */}
      {insights.length > 0 && (
        <div className="insights-section">
          <h3 className="section-title">💡 Your Insights</h3>
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <div key={index} className={`insight-card insight-${insight.type}`}>
                <span className="insight-icon">{insight.icon}</span>
                <p className="insight-message">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {stats && stats.categories_breakdown && Object.keys(stats.categories_breakdown).length > 0 && (
        <div className="category-section">
          <h3 className="section-title">📰 Category Breakdown</h3>
          <div className="category-bars">
            {Object.entries(stats.categories_breakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => {
                const percentage = (count / stats.total_articles_read) * 100;
                return (
                  <div key={category} className="category-bar">
                    <div className="category-info">
                      <span className="category-name">{category}</span>
                      <span className="category-count">{count} articles</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="category-percentage">{Math.round(percentage)}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Peak Reading Times */}
      {peakTimes && peakTimes.days_distribution && peakTimes.days_distribution.length > 0 && (
        <div className="peak-times-section">
          <h3 className="section-title">⏰ Your Reading Patterns</h3>
          
          <div className="peak-highlights">
            <div className="peak-highlight">
              <span className="peak-label">Most Active Day:</span>
              <span className="peak-value">{peakTimes.peak_day}</span>
            </div>
            <div className="peak-highlight">
              <span className="peak-label">Most Active Time:</span>
              <span className="peak-value">{peakTimes.peak_hour_label}</span>
            </div>
          </div>

          <div className="days-chart">
            <h4 className="chart-subtitle">Reading by Day of Week</h4>
            <div className="days-bars">
              {peakTimes.days_distribution.map((day) => {
                const maxCount = Math.max(...peakTimes.days_distribution.map(d => d.articles_read));
                const height = (day.articles_read / maxCount) * 100;
                return (
                  <div key={day.day} className="day-bar">
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{ height: `${height}%` }}
                        title={`${day.articles_read} articles`}
                      ></div>
                    </div>
                    <span className="day-label">{day.day.substring(0, 3)}</span>
                    <span className="day-count">{day.articles_read}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reading Timeline */}
      {timeline.length > 0 && (
        <div className="timeline-section">
          <h3 className="section-title">📅 Reading Activity Timeline</h3>
          <div className="timeline-chart">
            {timeline.slice(-14).map((day) => {
              const maxArticles = Math.max(...timeline.map(d => d.articles_read));
              const height = (day.articles_read / maxArticles) * 100;
              const date = new Date(day.date);
              const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
              
              return (
                <div key={day.date} className="timeline-bar">
                  <div className="bar-wrapper">
                    <div
                      className="bar-column"
                      style={{ height: `${height || 5}%` }}
                      title={`${day.articles_read} articles on ${day.date}`}
                    >
                      <span className="bar-tooltip">{day.articles_read}</span>
                    </div>
                  </div>
                  <span className="date-label">{dateLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats && stats.total_articles_read === 0 && (
        <div className="empty-analytics">
          <div className="empty-icon">📖</div>
          <h3>No Reading Data Yet</h3>
          <p>Start reading articles to see your personalized analytics and insights!</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
