// src/App.jsx
import React, { useState } from "react";
import Header from "./component/Header";
import EventList from "./component/EventList";
import eventsData from "./data/events.json";

function App() {
  const [joinedEvents, setJoinedEvents] = useState(() => {
    const saved = localStorage.getItem("joinedEvents");
    return saved ? JSON.parse(saved) : [];
  });

  const handleJoin = (event) => {
    setJoinedEvents((prev) => {
      if (prev.find((e) => e.id === event.id)) return prev;
      const next = [...prev, event];
      localStorage.setItem("joinedEvents", JSON.stringify(next));
      return next;
    });
  };

  const handleLeave = (event) => {
    setJoinedEvents((prev) => {
      const next = prev.filter((e) => e.id !== event.id);
      localStorage.setItem("joinedEvents", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div>
      <Header />
      <h2>Upcoming Events</h2>
      <EventList events={eventsData} onJoin={handleJoin} />

      <h2>My Events</h2>
      <EventList events={joinedEvents} onJoin={handleLeave} />
    </div>
  );
}

export default App;
