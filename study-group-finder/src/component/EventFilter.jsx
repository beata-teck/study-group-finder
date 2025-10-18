// src/components/EventFilter.jsx
import React from "react";

function EventFilter({ selectedCategory, onFilterChange }) {
  const studyCategories = ["Math", "Java", "C++", "Web", "Python"];
  const otherCategories = ["Sports", "Social"];

  return (
    <div className="filter-bar">
      <h3>Filter by Category</h3>
      <div className="filter-section">
        <strong>Study Subjects:</strong>
        {studyCategories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => onFilterChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filter-section">
        <strong>Other:</strong>
        {otherCategories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => onFilterChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <button
        className={!selectedCategory ? "active" : ""}
        onClick={() => onFilterChange(null)}
      >
        Show All
      </button>
    </div>
  );
}

export default EventFilter;