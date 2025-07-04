import React from "react";
import "./SponsoredCard.css";

const sponsoredPosts = [
  {
    id: 1,
    title: "Smarter Investing with AI",
    company: "FinTech Pro",
    image: "https://source.unsplash.com/featured/?finance,tech",
    link: "https://fintechpro.com",
  },
  {
    id: 2,
    title: "Upgrade Your Workflow Today",
    company: "ToolStack",
    image: "https://source.unsplash.com/featured/?productivity,software",
    link: "https://toolstack.com",
  },
  {
    id: 3,
    title: "Eco-Friendly Living Guide",
    company: "GreenLeaf",
    image: "https://source.unsplash.com/featured/?eco,nature",
    link: "https://greenleaf.com",
  },
];

const SponsoredCard = () => {
  return (
    <section className="sponsored-section" aria-label="Sponsored Content">
      <h2 className="sponsored-section__title">Sponsored</h2>
      <div className="sponsored-card__list">
        {sponsoredPosts.map((post) => (
          <a
            key={post.id}
            href={post.link}
            className="sponsored-card"
            aria-label={`Sponsored: ${post.title}`}
          >
            <span className="sponsored-card__label">Sponsored</span>
            <img
              src={post.image}
              alt={post.title}
              className="sponsored-card__image"
            />
            <div className="sponsored-card__content">
              <h3 className="sponsored-card__title">{post.title}</h3>
              <p className="sponsored-card__company">{post.company}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SponsoredCard;
