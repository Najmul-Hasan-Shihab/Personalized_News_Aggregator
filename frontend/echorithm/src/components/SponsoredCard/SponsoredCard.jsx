import React from "react";
import "./SponsoredCard.css";

const SponsoredCard = ({ image, title, company }) => {
  return (
    <section
      className="sponsored-card"
      role="complementary"
      aria-label="Sponsored content"
    >
      <span className="sponsored-card__label">Sponsored</span>
      <img src={image} alt={title} className="sponsored-card__image" />
      <h3 className="sponsored-card__title">{title}</h3>
      <p className="sponsored-card__company">{company}</p>
    </section>
  );
};

export default SponsoredCard;
