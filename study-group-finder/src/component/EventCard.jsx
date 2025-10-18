

function EventCard({ event, onJoin }) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p><strong>Subject:</strong> {event.subject}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <button onClick={() => onJoin(event)}>Join</button>
    </div>
  );
}

export default EventCard;