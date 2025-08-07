import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import SponsoredCard from "../components/SponsoredCard/SponsoredCard";
import NewestList from "../components/NewestList/NewestList";
import Footer from "../components/Footer/Footer";
import "./ForYou.css";

const ForYou = () => {
    const initialNews = [
        {
            id: 1,
            tag: "AI",
            title: "AI Breakthrough in 2025",
            summary: "A new AI model achieves record-breaking accuracy in medical diagnoses.",
            image: "https://via.placeholder.com/600x300",
            source: "The Verge",
            date: "1 Jul 2025",
        },
        {
            id: 2,
            tag: "Climate",
            title: "Extreme Weather Events Explained",
            summary: "Scientists link climate change to more frequent extreme weather.",
            image: "https://via.placeholder.com/600x300",
            source: "BBC",
            date: "30 Jun 2025",
        },
    ];

    const [newsList, setNewsList] = useState(initialNews);
    const [loading, setLoading] = useState(false);

    const loadMore = () => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const newItem = {
                id: newsList.length + 1,
                tag: "Tech",
                title: "New Tech Revolution 2025",
                summary: "Startups are driving innovation in consumer robotics.",
                image: "https://via.placeholder.com/600x300",
                source: "TechCrunch",
                date: "2 Jul 2025",
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
                    <div className="foryou__news-grid">
                        {newsList.map((item) => (
                            <div className="foryou-card" key={item.id}>
                                <span className="foryou-tag">Based on your interest in {item.tag}</span>
                                <h3>{item.title}</h3>
                                <p>{item.summary}</p>
                                <img src={item.image} alt={item.title} />
                                <div className="foryou-meta">
                                    <span>{item.source}</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 👇 Load More Button */}
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
