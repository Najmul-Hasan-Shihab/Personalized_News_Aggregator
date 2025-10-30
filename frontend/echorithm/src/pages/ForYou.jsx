import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFilteredArticles, fetchPreferences } from "../services/api";
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
        // Fetch user preferences and filtered articles
        const [prefsData, articlesData] = await Promise.all([
          fetchPreferences(),
          fetchFilteredArticles(),
        ]);

        setPreferences(prefsData.categories || []);
        setNewsList(articlesData.articles || []);

        if (articlesData.articles?.length === 0) {
          setError("No articles match your preferences. Try adding more categories in your profile.");
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
            <h2 className="section-title">🔍 Personalized for You</h2>
            {preferences.length > 0 && (
              <p className="preferences-info">
                Based on your interests: {preferences.join(", ")}
              </p>
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
                    {item.category && (
                      <div className="foryou-tag">
                        Based on your interest in {item.category}
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
                  Load More
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
