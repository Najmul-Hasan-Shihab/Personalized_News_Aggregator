import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

import Sidebar from "../components/Sidebar/Sidebar";
import SponsoredCard from "../components/SponsoredCard/SponsoredCard";
import NewestList from "../components/NewestList/NewestList";
import LoadMoreButton from "../components/LoadMoreButton/LoadMoreButton";
import Footer from "../components/Footer/Footer";

const Home = () => {
  const [news, setNews] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const templateNews = [
    {
      title: "AI Breakthrough in Renewable Energy",
      aiSummary:
        "AI system optimizes solar energy capture, potentially doubling efficiency.",
      url: "#",
      posScore: 12,
      negScore: 2,
    },
    {
      title: "Global Markets Surge After Policy Announcement",
      aiSummary:
        "New central bank policy boosts investor confidence, sparking a market rally.",
      url: "#",
      posScore: 20,
      negScore: 5,
    },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/articles/");
        const sorted = response.data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        setNews(sorted.length > 0 ? sorted : templateNews);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setNews(templateNews);
      }
    };

    fetchNews();
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
          <div className="home__news-grid">
            {filteredNews.slice(0, displayCount).map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card"
              >
                <div className="reaction-top-right">
                  <button className="happy-btn">😀 {item.posScore || 0}</button>
                  <button className="sad-btn">😞 {item.negScore || 0}</button>
                </div>
                <h3 className="news-title">{item.title}</h3>
                {item.aiSummary && (
                  <p className="ai-summary">{item.aiSummary}</p>
                )}
              </a>
            ))}
          </div>

          <LoadMoreButton onClick={loadMore} loading={false} />
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
