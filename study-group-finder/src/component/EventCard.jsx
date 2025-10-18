// src/components/EventCard.jsx
import React from "react";

function EventCard({ event, onJoin, onRemove, isJoined }) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p><strong>Subject:</strong> {event.subject}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>

      {!isJoined && onJoin && (
        <button onClick={() => onJoin(event)}>Join</button>
      )}

      {isJoined && onRemove && (
        <button 
          onClick={() => onRemove(event.id)} 
          style={{ backgroundColor: "red" }}
        >
          Remove
        </button>
      )}
    </div>
  );
}

export default EventCard;