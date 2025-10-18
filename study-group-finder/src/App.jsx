// src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import EventList from "./components/EventList";
import MyEvents from "./components/MyEvents";
import EventFilter from "./components/EventFilter";
import eventsData from "./data/events.json";

function App() {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [theme, setTheme] = useState("light"); // ✅ new state

  useEffect(() => {
    const savedEvents = localStorage.getItem("joinedEvents");
    if (savedEvents) {
      setJoinedEvents(JSON.parse(savedEvents));
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
  }, [joinedEvents]);

  useEffect(() => {
    document.body.className = theme; // ✅ apply theme to body
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleJoin = (event) => {
    if (!joinedEvents.find((e) => e.id === event.id)) {
      setJoinedEvents([...joinedEvents, event]);
    }
  };

  const handleRemove = (id) => {
    const updated = joinedEvents.filter((e) => e.id !== id);
    setJoinedEvents(updated);
  };

  const filteredEvents = selectedCategory
    ? eventsData.filter((e) => e.category === selectedCategory)
    : eventsData;

  return (
    <div>
      <Header />

      {/* ✅ Theme toggle button */}
      <div style={{ textAlign: "center", margin: "1rem" }}>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>

      <main style={{ padding: "1rem" }}>
        <section>
          <h2>Upcoming Events</h2>
          <EventFilter
            selectedCategory={selectedCategory}
            onFilterChange={setSelectedCategory}
          />
          <EventList events={filteredEvents} onJoin={handleJoin} />
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
