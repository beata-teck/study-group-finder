// src/components/EventCard.jsx
import React from "react";

function EventCard({ event, onJoin, onRemove, isJoined }) {
  return (
    <div className="event-card card">
      <h3>{event.title}</h3>
      <p style={{ margin: "0.25rem 0", color: "var(--muted)" }}>
        <strong>Subject:</strong> {event.subject}
      </p>
      <p style={{ margin: "0.25rem 0", color: "var(--muted)" }}>
        <strong>Date:</strong> {event.date}
      </p>
      <p style={{ margin: "0.25rem 0", color: "var(--muted)" }}>
        <strong>Location:</strong> {event.location}
      </p>

      {!isJoined && onJoin && (
        <button className="btn btn-primary" onClick={() => onJoin(event)}>
          Join
        </button>
      )}

      {isJoined && onRemove && (
        <button className="btn btn-danger" onClick={() => onRemove(event.id)}>
          Remove
        </button>
      )}
    </div>
  );
}

export default EventCard;