
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import EventList from "./components/EventList";
import MyEvents from "./components/MyEvents";
import EventFilter from "./components/EventFilter";
import eventsData from "./data/events.json";
import CalendarView from "./components/CalanderVeiw"; 

function App() {
  // Joined events persisted in localStorage
  const [joinedEvents, setJoinedEvents] = useState(() => {
    const saved = localStorage.getItem("joinedEvents");
    return saved ? JSON.parse(saved) : [];
  });

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Theme persisted in localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // Persist joined events
  useEffect(() => {
    localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
  }, [joinedEvents]);

  // Apply and persist theme
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Join event (expects full event object)
  const handleJoin = (event) => {
    if (!joinedEvents.find((e) => e.id === event.id)) {
      setJoinedEvents((prev) => [...prev, event]);
    }
  };

  // Leave/remove event (by id)
  const handleLeave = (id) => {
    setJoinedEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Filter events by category
  const filteredEvents = selectedCategory
    ? eventsData.filter((e) => e.category === selectedCategory)
    : eventsData;

  return (
    <div>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="brand">
            <span className="brand-badge" />
            <span>Study Finder</span>
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </div>
      </div>

      <Header />

      <main>
        <div className="container">
          <section>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Browse and join sessions that fit your schedule.</p>
            <EventFilter
              selectedCategory={selectedCategory}
              onFilterChange={setSelectedCategory}
            />
            <EventList events={filteredEvents} onJoin={handleJoin} />
          </section>

          <section>
            <h2 className="section-title">My Events</h2>
            <p className="section-subtitle">Your joined events and groups.</p>
            <MyEvents joinedEvents={joinedEvents} onRemove={handleLeave} />
          </section>

          <section>
            <h2 className="section-title">Calendar View</h2>
            <p className="section-subtitle">See events across the month at a glance.</p>
            <CalendarView
              events={eventsData}
              joinedEvents={joinedEvents}
              onJoin={handleJoin}
              onLeave={handleLeave}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
