
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import EventList from "./components/EventList";
import MyEvents from "./components/MyEvents";
import EventFilter from "./components/EventFilter";
import eventsData from "./data/events.json";
import CalendarView from "./components/CalanderVeiw"; 
import CreateEventModal from "./components/CreateEventModal";
import { useToast } from "./components/Toaster.jsx";
import EventCard from "./components/EventCard";

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
  const [profileName, setProfileName] = useState(() => localStorage.getItem("profileName") || "");
  const toast = useToast();
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

  // Persist profile name
  useEffect(() => {
    localStorage.setItem("profileName", profileName);
  }, [profileName]);

  // Join event (expects full event object)
  const handleJoin = (event) => {
    if (!joinedEvents.find((e) => e.id === event.id)) {
      setJoinedEvents((prev) => [...prev, event]);
      incrementJoinCount(event.id);
      const undo = () => setJoinedEvents((prev) => prev.filter((e) => e.id !== event.id));
      toast?.show({ title: "Joined", message: event.title, actionLabel: "Undo", onAction: undo, variant: "success" });
    }
  };

  // Leave/remove event (by id)
  const handleLeave = (id) => {
    setJoinedEvents((prev) => prev.filter((e) => e.id !== id));
    toast?.show({ title: "Left event", message: String(id), variant: "info" });
  };

  const incrementJoinCount = (eventId) => {
    try {
      const counts = JSON.parse(localStorage.getItem('joinCounts') || '{}');
      counts[eventId] = (counts[eventId] || 0) + 1;
      localStorage.setItem('joinCounts', JSON.stringify(counts));
    } catch {}
  };

  const getJoinCount = (eventId) => {
    try {
      const counts = JSON.parse(localStorage.getItem('joinCounts') || '{}');
      return counts[eventId] || 0;
    } catch { return 0 }
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
            <span style={{ marginRight: "0.75rem" }}>
              {profileName ? (
                <span>Hello, <strong>{profileName}</strong></span>
              ) : (
                <button className="btn btn-ghost" onClick={() => {
                  const name = prompt('Enter your name');
                  if (name) setProfileName(name);
                }}>Set name</button>
              )}
            </span>
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
            <h2 className="section-title">Trending this week</h2>
            <p className="section-subtitle">Most joined recently</p>
            <div className="grid-list">
              {allEvents
                .map((e) => ({ e, c: getJoinCount(e.id) }))
                .sort((a, b) => b.c - a.c)
                .slice(0, 5)
                .map(({ e }) => (
                  <EventCard key={e.id} event={e} onJoin={handleJoin} isJoined={joinedEvents.some((j) => j.id === e.id)} />
                ))}
            </div>
          </section>
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
              joinedEvents={joinedEvents}
            />
          </section>

          <section>
            <h2 className="section-title">My Events</h2>
            <p className="section-subtitle">Your joined events and groups.</p>
            <MyEvents
              joinedEvents={joinedEvents}
              onRemove={handleLeave}
              onRemoveAll={() => setJoinedEvents([])}
            />
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
            const isEdit = customEvents.some((c) => c.id === ev.id);
            handleSaveCustom(ev);
            setShowCreate(false);
            toast?.show({ title: isEdit ? "Event updated" : "Event created", message: ev.title, variant: "success" });
          }}
          initialEvent={typeof showCreate === 'object' ? showCreate : undefined}
          onDelete={(id) => {
            handleDeleteCustom(id);
            setShowCreate(false);
            toast?.show({ title: "Event deleted", message: String(id), variant: "error" });
          }}
        />
      )}
    </div>
  );
}

export default App;
