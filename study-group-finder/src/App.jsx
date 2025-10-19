import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import EventList from "./components/EventList";
import MyEvents from "./components/MyEvents";
import EventFilter from "./components/EventFilter";
import eventsData from "./data/events.json";
import CalendarView from "./components/CalanderVeiw";

function App() {
  // ✅ Initialize from localStorage directly
  const [joinedEvents, setJoinedEvents] = useState(() => {
    const saved = localStorage.getItem("joinedEvents");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
  }, [joinedEvents]);
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Add event
  const handleJoin = (event) => {
    if (!joinedEvents.find((e) => e.id === event.id)) {
      setJoinedEvents([...joinedEvents, event]);
    }
  };

  // Remove event
  const handleRemove = (id) => {
    const updated = joinedEvents.filter((e) => e.id !== id);
    setJoinedEvents(updated);
  };

  // Filter events
  const filteredEvents = selectedCategory
    ? eventsData.filter((e) => e.category === selectedCategory)
    : eventsData;

  return (
    <div>
      <Header />

      {/* Theme toggle */}
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
      <section>
  <h2>Calendar View</h2>
  <CalendarView 
  events={eventsData} 
  onJoin={handleJoin} 
  onLeave={handleLeave} 
/>
</section>

    </div>
  );
}

export default App;
