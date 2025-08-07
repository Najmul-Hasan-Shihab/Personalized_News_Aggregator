import React, { useState } from "react";
import "./Home.css";

import Sidebar from "../components/Sidebar/Sidebar";
import NewsCard from "../components/NewsCard/NewsCard";
import SponsoredCard from "../components/SponsoredCard/SponsoredCard";
import NewestList from "../components/NewestList/NewestList";
import LoadMoreButton from "../components/LoadMoreButton/LoadMoreButton";
import Footer from "../components/Footer/Footer";

const Home = () => {
  const [news, setNews] = useState([
    {
      id: 1,
      title: "AI Breakthrough in 2025",
      description: "A new AI model breaks benchmark records.",
      image: "https://via.placeholder.com/600x300",
      source: "The Verge",
      date: "2025-07-01",
      author: "Jane Doe",
    },
    {
      id: 2,
      title: "Climate Summit Highlights",
      description: "Key takeaways from the latest global conference.",
      image: "https://via.placeholder.com/600x300",
      source: "BBC",
      date: "2025-06-30",
      author: "John Smith",
    },
  ]);

  const latestPosts = [
    { id: 101, title: "Meta unveils AI glasses", link: "#", date: "2025-06-28" },
    { id: 102, title: "Nobel winners announced", link: "#", date: "2025-06-27" },
  ];

  const loadMore = () => {
    setNews((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: "More News",
        description: "Additional article loaded.",
        image: "https://via.placeholder.com/600x300",
        source: "Reuters",
        date: "2025-07-01",
        author: "Guest Writer",
      },
    ]);
  };

  return (
    <>
      {/* ✅ Header removed here */}

      <main className="home">
        <aside className="home__sidebar">
          <Sidebar />
        </aside>

        <section className="home__main-content">
          <div className="home__news-grid">
            {news.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>

          <LoadMoreButton onClick={loadMore} loading={false} />
        </section>

        <aside className="home__rightbar">
          <SponsoredCard
            title="Upgrade to Premium!"
            company="Echorithm Ads"
            image="https://via.placeholder.com/600x200"
          />
          <NewestList posts={latestPosts} />
        </aside>
      </main>

      <Footer />
    </>
  );
};

export default Home;
