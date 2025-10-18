// src/components/EventFilter.jsx
import React from "react";
import eventsData from "../data/events.json";

function EventFilter({ selectedCategory, onFilterChange }) {
  const categories = Array.from(
    new Set((eventsData || []).map((e) => e.category).filter(Boolean))
  );

  return (
    <div className="filter-bar">
      <h3>Filter by Category</h3>
      <div className="filter-section">
        <label style={{ marginRight: "0.5rem" }}>Category:</label>
        <select
          value={selectedCategory || ""}
          onChange={(e) =>
            onFilterChange(
              e.target.value === "" ? null : e.target.value
            )
          }
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default EventFilter;