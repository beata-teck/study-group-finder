// src/components/CalendarView.jsx
import React, { useState } from "react";

function CalendarView({ events }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Get first day of month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Map events by date
  const eventMap = {};
  events.forEach((event) => {
    const eventDate = new Date(event.date);
    if (
      eventDate.getFullYear() === currentYear &&
      eventDate.getMonth() === currentMonth
    ) {
      const day = eventDate.getDate();
      if (!eventMap[day]) eventMap[day] = [];
      eventMap[day].push(event);
    }
  });

  // Build calendar cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="empty"></div>);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      <div key={d} className={`day ${eventMap[d] ? "has-event" : ""}`}>
        <span className="date">{d}</span>
        {eventMap[d] && (
          <ul className="event-list">
            {eventMap[d].map((e) => (
              <li key={e.id}>{e.title}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Navigation handlers
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h2>
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </h2>
        <button onClick={nextMonth}>▶</button>
        <button className="today-btn" onClick={goToToday}>Today</button>
      </div>

      <div className="calendar-grid">
        <div className="day-name">Sun</div>
        <div className="day-name">Mon</div>
        <div className="day-name">Tue</div>
        <div className="day-name">Wed</div>
        <div className="day-name">Thu</div>
        <div className="day-name">Fri</div>
        <div className="day-name">Sat</div>
        {cells}
      </div>
    </div>
  );
}

export default CalendarView;