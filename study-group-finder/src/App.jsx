// src/App.jsx
import React, { useState } from "react";
import Header from "./components/Header";
import EventList from "./components/EventList";
import eventsData from "./data/events.json";

function App() {
  const [joinedEvents, setJoinedEvents] = useState([]);

  const handleJoin = (event) => {
    if (!joinedEvents.find((e) => e.id === event.id)) {
      setJoinedEvents([...joinedEvents, event]);
      localStorage.setItem("joinedEvents", JSON.stringify([...joinedEvents, event]));
    }
  };

  return (
    <div>
      <Header />
      <h2>Upcoming Events</h2>
      <EventList events={eventsData} onJoin={handleJoin} />

      <h2>My Events</h2>
      <EventList events={joinedEvents} onJoin={() => {}} />
    </div>
  );
}

export default App;
