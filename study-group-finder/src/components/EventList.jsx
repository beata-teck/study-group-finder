import React from "react";

export default function EventList({ events = [], onJoin }) {
  if (!events || events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {events.map((ev) => (
        <li
          key={ev.id}
          style={{
            marginBottom: "0.75rem",
            borderBottom: "1px solid #eee",
            paddingBottom: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{ev.title}</strong>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                {ev.category}
              </div>
              {ev.date && (
                <div style={{ fontSize: "0.85rem", color: "#888" }}>
                  {ev.date}
                </div>
              )}
            </div>
            <div>
              <button
                onClick={() => onJoin && onJoin(ev)}
                style={{ padding: "0.4rem 0.6rem" }}
              >
                Join
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}