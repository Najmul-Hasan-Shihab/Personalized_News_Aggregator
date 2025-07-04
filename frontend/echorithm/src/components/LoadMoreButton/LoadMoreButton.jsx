import React from "react";
import "./LoadMoreButton.css";

const LoadMoreButton = ({ onClick, loading }) => {
  return (
    <div className="load-more">
      <button
        className="load-more__button"
        onClick={onClick}
        disabled={loading}
        aria-label="Load more articles"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
};

export default LoadMoreButton;
