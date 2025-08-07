import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

import Header from "../components/Header/Header";
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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/articles/");
        const sorted = response.data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        setNews(sorted);
      } catch (error) {
        console.error("Error fetching articles:", error);
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
    image: item.image || item.urlToImage,
    summary: item.summary || "No summary available.",
  }));

  return (
    <>
      <Header />

      <main className="home">
        <aside className="home__sidebar">
          <Sidebar onCategoryClick={handleCategoryClick} />
        </aside>

        <section className="home__main-content">
          <div className="home__news-grid">
            {filteredNews.slice(5, displayCount).map((item, index) => (
              <NewsCard
                key={index}
                title={item.title}
                image={item.image || item.urlToImage}
                source={item.source}
                date={item.publishedAt || item.ingested_at}
                author={item.author || "Unknown"}
                summary={item.summary}
                link={item.url}
              />
            ))}
          </div>

          <LoadMoreButton onClick={loadMore} loading={false} />
        </section>

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
