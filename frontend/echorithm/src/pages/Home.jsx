import React, { useEffect, useState } from "react";
import { fetchArticles } from "../services/api";
import "./Home.css";

import Sidebar from "../components/Sidebar/Sidebar";
import NewsCard from "../components/NewsCard/NewsCard";
import SponsoredCard from "../components/SponsoredCard/SponsoredCard";
import NewestList from "../components/NewestList/NewestList";
import LoadMoreButton from "../components/LoadMoreButton/LoadMoreButton";
import Footer from "../components/Footer/Footer";

const Home = () => {
  const [news, setNews] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchArticles();
        const sorted = data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        setNews(sorted);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setDisplayCount(10);
  };

  const filteredNews =
    selectedCategory === "All"
      ? news
      : news.filter(
          (item) =>
            item.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const loadMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  const latestPosts = filteredNews.slice(0, 5).map((item, i) => ({
    id: i,
    title: item.title,
    link: item.url || "#",
    date: item.publishedAt || item.ingested_at || item.date,
  }));

  return (
    <>
      <main className="home">
        {/* Left Sidebar */}
        <aside className="home__sidebar">
          <Sidebar onCategoryClick={handleCategoryClick} />
        </aside>

        {/* Main News Section */}
        <section className="home__main-content">
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading articles...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="empty-state">
              <h2>No articles found</h2>
              <p>
                {selectedCategory === "All"
                  ? "No articles available. Please check back later."
                  : `No articles found in category: ${selectedCategory}`}
              </p>
            </div>
          ) : (
            <>
              <div className="home__news-grid">
                {filteredNews.slice(0, displayCount).map((item, index) => (
                  <NewsCard
                    key={index}
                    title={item.title}
                    image={item.urlToImage}
                    source={item.source}
                    date={item.publishedAt || item.ingested_at || item.date}
                    author={item.author}
                    summary={item.summary}
                    link={item.url}
                    category={item.category}
                    sentiment_label={item.sentiment_label}
                    sentiment_confidence={item.sentiment_confidence}
                    entities={item.entities}
                  />
                ))}
              </div>

              {displayCount < filteredNews.length && (
                <LoadMoreButton onClick={loadMore} loading={false} />
              )}
            </>
          )}
        </section>

        {/* Right Sidebar */}
        <aside className="home__rightbar">
          <NewestList posts={latestPosts} />
          <SponsoredCard
            title="Upgrade to Premium!"
            company="Echorithm Ads"
            image="https://via.placeholder.com/600x200"
          />
        </aside>
      </main>

      <Footer />
    </>
  );
};

export default Home;
