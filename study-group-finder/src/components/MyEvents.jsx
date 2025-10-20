import React from "react";
import EventCard from "./EventCard";

export default function MyEvents({ joinedEvents = [], onRemove }) {
  if (!joinedEvents || joinedEvents.length === 0) {
    return <p className="section-subtitle">You haven't joined any events yet.</p>;
  }

  return (
    <div className="grid-list">
      {joinedEvents.map((ev) => (
        <EventCard key={ev.id} event={ev} isJoined onRemove={onRemove} />
      ))}
    </div>
  );
}
