// src/components/CalendarView.jsx
import React from "react";

function CalendarView({ events }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = Jan

  // Get first day of month
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map events by date
  const eventMap = {};
  events.forEach((event) => {
    const eventDate = new Date(event.date);
    if (
      eventDate.getFullYear() === year &&
      eventDate.getMonth() === month
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

  return (
    <div className="calendar">
      <h2>
        {today.toLocaleString("default", { month: "long" })} {year}
      </h2>
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