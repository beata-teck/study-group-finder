
import EventCard from "./EventCard";

function EventList({ events, onJoin }) {
  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onJoin={onJoin} />
      ))}
    </div>
  );
}

export default EventList;