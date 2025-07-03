import React from "react";
import "./NewestList.css";

const NewestList = ({ posts }) => {
  return (
    <section className="newest-list" aria-label="Latest Posts">
      <h2 className="newest-list__title">Latest News</h2>
      <ul className="newest-list__items">
        {posts.map((post) => (
          <li key={post.id} className="newest-list__item">
            <a href={post.link} className="newest-list__link">
              {post.title}
            </a>
            <time dateTime={post.date} className="newest-list__date">
              {new Date(post.date).toLocaleDateString()}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewestList;
