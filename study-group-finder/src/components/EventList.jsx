import React from "react";
import EventCard from "./EventCard";

export default function EventList({ events = [], onJoin }) {
  if (!events || events.length === 0) {
    return <p className="section-subtitle">No events found.</p>;
  }

  return (
    <div className="grid-list">
      {events.map((ev) => (
        <EventCard key={ev.id} event={ev} onJoin={onJoin} />
      ))}
    </div>
  );
}