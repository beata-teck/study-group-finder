// src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./component/Header";
import EventList from "./component/EventList";
import MyEvents from "./component/MyEvent";
import eventsData from "./data/events.json";

function App() {
  const [joinedEvents, setJoinedEvents] = useState([]);

  // ✅ Load joined events from local storage when app starts
  useEffect(() => {
    const savedEvents = localStorage.getItem("joinedEvents");
    if (savedEvents) {
      setJoinedEvents(JSON.parse(savedEvents));
    }
  }, []);

  // ✅ Save joined events whenever they change
  useEffect(() => {
    localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
  }, [joinedEvents]);

  // ✅ Add event to My Events
  const handleJoin = (event) => {
    if (!joinedEvents.find((e) => e.id === event.id)) {
      setJoinedEvents([...joinedEvents, event]);
    }
  };

  // ✅ Remove event from My Events
  const handleRemove = (id) => {
    const updated = joinedEvents.filter((e) => e.id !== id);
    setJoinedEvents(updated);
  };

  return (
    <div>
      <Header />

      <main style={{ padding: "1rem" }}>
        <section>
          <h2>Upcoming Events</h2>
          <EventList events={eventsData} onJoin={handleJoin} />
        </section>

        <section>
          <h2>My Events</h2>
          <MyEvents joinedEvents={joinedEvents} onRemove={handleRemove} />
        </section>
      </main>
    </div>
  );
}

export default App;
