// src/components/CalendarView.jsx
import React, { useState } from "react";
import "./CalendarView.css";

function CalendarView({ events, onJoin, onLeave }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

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

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="empty"></div>);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    cells.push(
      <div
        key={d}
        className={`day ${eventMap[d] ? "has-event" : ""} ${isToday ? "today" : ""}`}
        onClick={() => eventMap[d] && setSelectedDay({ day: d, events: eventMap[d] })}
      >
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
        <h2>{monthName} {currentYear}</h2>
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

      {selectedDay && (
        <div className="event-popup">
          <div className="popup-content">
            <h3>Events on {selectedDay.day} {monthName} {currentYear}</h3>
            <ul>
              {selectedDay.events.map((e) => (
                <li key={e.id}>
                  <strong>{e.title}</strong><br />
                  {e.description || "No description"}<br />
                  {e.time && <em>{e.time}</em>}<br />
                  {e.joined ? (
                    <button onClick={() => onLeave(e.id)}>Leave</button>
                  ) : (
                    <button onClick={() => onJoin(e.id)}>Join</button>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedDay(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;