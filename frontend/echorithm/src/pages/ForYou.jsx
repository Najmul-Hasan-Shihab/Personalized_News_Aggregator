import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPersonalizedRecommendations, fetchPreferences } from "../services/api";
import Sidebar from "../components/Sidebar/Sidebar";
import NewsCard from "../components/NewsCard/NewsCard";
import SponsoredCard from "../components/SponsoredCard/SponsoredCard";
import NewestList from "../components/NewestList/NewestList";
import Footer from "../components/Footer/Footer";
import "./ForYou.css";

const ForYou = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [recommendationEngine, setRecommendationEngine] = useState("");
  const [readingHistoryCount, setReadingHistoryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPersonalizedNews = async () => {
      // Check if user is logged in
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/auth");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch user preferences and ML-powered personalized recommendations
        const [prefsData, recommendationsData] = await Promise.all([
          fetchPreferences(),
          fetchPersonalizedRecommendations(100), // Fetch more for better UX
        ]);

        setPreferences(prefsData.categories || []);
        setNewsList(recommendationsData.articles || []);
        setRecommendationEngine(recommendationsData.recommendation_engine || "");
        setReadingHistoryCount(recommendationsData.reading_history_count || 0);

        if (recommendationsData.articles?.length === 0) {
          setError(
            recommendationsData.message || 
            "No articles match your preferences. Try adding more categories in your profile."
          );
        }
      } catch (err) {
        console.error("Error loading personalized news:", err);
        if (err.response?.status === 401) {
          navigate("/auth");
        } else {
          setError("Failed to load personalized news. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPersonalizedNews();
  }, [navigate]);

  const loadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  const latestPosts = newsList.slice(0, 5).map((item, i) => ({
    id: i,
    title: item.title,
    link: item.url,
    date: item.publishedAt || item.date,
  }));

  return (
    <>
      <main className="foryou">
        <aside className="foryou__sidebar">
          <Sidebar />
        </aside>

        <section className="foryou__main-content">
          <div className="foryou__header">
            <h2 className="section-title">🎯 Personalized for You</h2>
            {preferences.length > 0 && (
              <div className="preferences-info-box">
                <p className="preferences-info">
                  <strong>Your Interests:</strong> {preferences.join(", ")}
                </p>
                {recommendationEngine && (
                  <p className="ml-engine-info">
                    <span className="ai-badge">🤖 AI</span> {recommendationEngine}
                    {readingHistoryCount > 0 && (
                      <span className="history-badge">
                        {" "}• Learning from {readingHistoryCount} articles you've read
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading your personalized feed...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={() => navigate("/profile")}>
                Update Preferences
              </button>
            </div>
          ) : newsList.length === 0 ? (
            <div className="empty-state">
              <h3>No personalized articles yet</h3>
              <p>Set your preferences to get personalized news recommendations.</p>
              <button onClick={() => navigate("/profile")}>
                Set Preferences
              </button>
            </div>
          ) : (
            <>
              <div className="foryou__news-grid">
                {newsList.slice(0, displayCount).map((item, index) => (
                  <div key={index} className="foryou-card-wrapper">
                    {item.recommendation_reason && (
                      <div className="foryou-tag">
                        💡 {item.recommendation_reason}
                      </div>
                    )}
                    {item.recommendation_score && (
                      <div className="recommendation-score-badge">
                        Match: {Math.round(item.recommendation_score)}%
                      </div>
                    )}
                    <NewsCard
                      title={item.title}
                      image={item.urlToImage}
                      source={item.source}
                      date={item.publishedAt || item.date}
                      author={item.author}
                      summary={item.summary}
                      link={item.url}
                      category={item.category}
                      sentiment_label={item.sentiment_label}
                      sentiment_confidence={item.sentiment_confidence}
                      entities={item.entities}
                    />
                  </div>
                ))}
              </div>

              {displayCount < newsList.length && (
                <button
                  className="foryou__load-more"
                  onClick={loadMore}
                  disabled={loading}
                >
                  Load More Recommendations
                </button>
              )}
            </>
          )}
        </section>

        <aside className="foryou__rightbar">
          <NewestList posts={latestPosts} />
          <SponsoredCard
            title="Smarter Investing with AI"
            company="FinTech Pro"
            image="https://via.placeholder.com/600x200"
          />
        </aside>
      </main>

      <Footer />
    </>
  );
};

export default ForYou;
