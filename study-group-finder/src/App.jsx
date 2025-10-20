
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import EventList from "./components/EventList";
import MyEvents from "./components/MyEvents";
import EventFilter from "./components/EventFilter";
import eventsData from "./data/events.json";
import CalendarView from "./components/CalanderVeiw"; 
import CreateEventModal from "./components/CreateEventModal";

function App() {
  // Joined events persisted in localStorage
  const [joinedEvents, setJoinedEvents] = useState(() => {
    const saved = localStorage.getItem("joinedEvents");
    return saved ? JSON.parse(saved) : [];
  });

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Theme persisted in localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [showCreate, setShowCreate] = useState(false);
  const [customEvents, setCustomEvents] = useState(() => {
    const saved = localStorage.getItem("customEvents");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist joined events
  useEffect(() => {
    localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
  }, [joinedEvents]);

  // Apply and persist theme
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Persist custom events
  useEffect(() => {
    localStorage.setItem("customEvents", JSON.stringify(customEvents));
  }, [customEvents]);

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

  const allEvents = [...eventsData, ...customEvents];

  // Filter events by category and search
  const filteredEvents = (allEvents || []).filter((e) => {
    const matchesCategory = selectedCategory ? e.category === selectedCategory : true;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q
      ? [e.title, e.subject, e.location, e.category]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      : true;
    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const handleSaveCustom = (ev) => {
    setCustomEvents((prev) => {
      const exists = prev.some((p) => p.id === ev.id);
      return exists ? prev.map((p) => (p.id === ev.id ? ev : p)) : [...prev, ev];
    });
  };

  const handleDeleteCustom = (id) => {
    if (!confirm("Delete this event?")) return;
    setCustomEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const goToCalendar = () => {
    const el = document.getElementById("calendar-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="brand">
            <span className="brand-badge" />
            <span>Study Finder</span>
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreate(true)}
              aria-label="Create event"
              title="Create event"
              style={{ marginRight: "0.5rem" }}
            >
              + Create Event
            </button>
            <button
              className="btn btn-ghost"
              onClick={goToCalendar}
              aria-label="Go to calendar"
              title="Calendar"
              style={{ marginRight: "0.5rem" }}
            >
              📅 Calendar
            </button>
          <button
            className="btn btn-ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
          </div>
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
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearAll={clearFilters}
            />
            <EventList
              events={filteredEvents}
              onJoin={handleJoin}
              onEdit={(ev) => setShowCreate(ev)}
              onDelete={handleDeleteCustom}
            />
          </section>

          <section>
            <h2 className="section-title">My Events</h2>
            <p className="section-subtitle">Your joined events and groups.</p>
            <MyEvents joinedEvents={joinedEvents} onRemove={handleLeave} />
          </section>

          <section id="calendar-section">
            <h2 className="section-title">Calendar View</h2>
            <p className="section-subtitle">See events across the month at a glance.</p>
            <CalendarView
              events={allEvents}
              joinedEvents={joinedEvents}
              onJoin={handleJoin}
              onLeave={handleLeave}
            />
          </section>
        </div>
      </main>

      {showCreate && (
        <CreateEventModal
          onClose={() => setShowCreate(false)}
          onSave={(ev) => {
            handleSaveCustom(ev);
            setShowCreate(false);
          }}
          initialEvent={typeof showCreate === 'object' ? showCreate : undefined}
          onDelete={(id) => {
            handleDeleteCustom(id);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
