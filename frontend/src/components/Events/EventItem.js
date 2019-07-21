import React from "react";

const EventItem = ({ events, authUserId, onDetail }) => {
  return events.map(event => {
    const date = new Date(event.date).toLocaleDateString();
    return (
      <li className="events__list-item" key={event._id}>
        <div>
          <h1> {event.title}</h1>
          <h2>
            ${event.price} - {date}{" "}
          </h2>
        </div>
        <div>
          {event.creator._id === authUserId ? (
            <p>This is your event</p>
          ) : (
            <button className="btn" onClick={() => onDetail(event._id)}>
              View Details
            </button>
          )}
        </div>
      </li>
    );
  });
};

export default EventItem;
