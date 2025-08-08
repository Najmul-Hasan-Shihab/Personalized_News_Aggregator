import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import SponsoredCard from "../components/SponsoredCard/SponsoredCard";
import NewestList from "../components/NewestList/NewestList";
import Footer from "../components/Footer/Footer";
import "./ForYou.css";

const ForYou = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch personalized articles on mount
  useEffect(() => {
    const fetchPersonalizedArticles = async () => {
        let token = localStorage.getItem("access_token");
        const refresh = localStorage.getItem("refresh_token");

        const tryFetch = async (accessToken) => {
            const res = await fetch("http://localhost:8000/articles/filtered/", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            });

            if (res.status === 401) {
            console.warn("Access token invalid or expired.");
            return null;
            }

            const data = await res.json();
            return data;
        };

        let data = await tryFetch(token);

        // 🔄 If token is expired, try refreshing
        if (!data || data.code === "token_not_valid") {
            console.log("⏳ Refreshing token...");
            const res = await fetch("http://localhost:8000/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
            });

            if (res.ok) {
            const tokens = await res.json();
            localStorage.setItem("access_token", tokens.access); // Save new access token
            token = tokens.access;

            data = await tryFetch(token); // Retry fetching articles
            } else {
            console.error("❌ Refresh token is invalid. Please log in again.");
            return;
            }
        }

        if (data && data.articles) {
            setNewsList(data.articles);
        } else {
            console.warn("No personalized articles found.");
        }

        setLoading(false);
        };


    fetchPersonalizedArticles();
  }, []);

  // Optional: Simulate "Load More" with placeholder articles (or enhance later)
  const loadMore = () => {
    setLoading(true);

    setTimeout(() => {
      const newItem = {
        id: newsList.length + 1,
        tag: "Innovation",
        title: "New Tech Revolution 2025",
        summary: "Startups are driving innovation in consumer robotics.",
        image: "https://via.placeholder.com/600x300",
        source: "TechCrunch",
        date: "8 Aug 2025"
      };

      setNewsList((prev) => [...prev, newItem]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <main className="foryou">
        <aside className="foryou__sidebar">
          <Sidebar />
        </aside>

        <section className="foryou__main-content">
          <h2 className="section-title">🔍 Personalized for You</h2>

          {loading ? (
            <p>Loading personalized articles...</p>
          ) : newsList.length === 0 ? (
            <p>No articles found for your preferences. Try updating them in your profile.</p>
          ) : (
            <div className="foryou__news-grid">
              {newsList.map((item, index) => (
                <div className="foryou-card" key={index}>
                  <span className="foryou-tag">
                    Based on your interest in {item.category || "General"}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <img src={item.image || "https://via.placeholder.com/600x300"} alt={item.title} />
                  <div className="foryou-meta">
                    <span>{item.source}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className="foryou__load-more"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? <span className="loader"></span> : "Load More"}
          </button>
        </section>

        <aside className="foryou__rightbar">
          <SponsoredCard
            title="Smarter Investing with AI"
            company="FinTech Pro"
            image="https://via.placeholder.com/600x200"
          />
          <NewestList posts={[]} />
        </aside>
      </main>

      <Footer />
    </>
  );
};

export default ForYou;
