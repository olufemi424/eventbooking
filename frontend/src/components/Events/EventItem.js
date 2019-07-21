import React from "react";

const EventItem = ({ events, authUserId }) => {
  return events.map(event => {
    return (
      <li className="events__list-item" key={event._id}>
        <div>
          <h1> {event.title}</h1>
          <h2>${event.price}</h2>
        </div>
        <div>
          {event.creator._id === authUserId ? (
            <p>This is your event</p>
          ) : (
            <button className="btn">View Details</button>
          )}
        </div>
      </li>
    );
  });
};

export default EventItem;
