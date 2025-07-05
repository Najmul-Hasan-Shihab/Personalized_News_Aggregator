import React from "react";
import "./NewestList.css";

const NewestList = ({ posts }) => {
  return (
    <section className="newest-list" aria-label="Latest Posts">
      <h2 className="newest-list__title">Latest News</h2>
      <ul className="newest-list__items">
        {posts.map((post) => (
          <li key={post.id} className="newest-list__item">
            <a href={post.link} className="newest-list__card" aria-label={post.title} target="_blank" rel="noopener noreferrer">
              <img src={post.image} alt={post.title} className="newest-list__image" />
              <div className="newest-list__content">
                <h3 className="newest-list__headline">{post.title}</h3>
                <p className="newest-list__summary">{post.summary}</p>
                <time dateTime={post.date} className="newest-list__date">
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewestList;
