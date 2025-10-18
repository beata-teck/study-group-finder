import React from "react";

export default function MyEvents({ joinedEvents = [], onRemove }) {
  if (!joinedEvents || joinedEvents.length === 0) {
    return <p>You haven't joined any events yet.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {joinedEvents.map((ev) => (
        <li key={ev.id} style={{ marginBottom: "0.75rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{ev.title}</strong>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>{ev.category}</div>
            </div>
            <div>
              <button onClick={() => onRemove && onRemove(ev.id)} style={{ padding: "0.35rem 0.6rem", background: "#f66", color: "#fff", border: "none" }}>
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
