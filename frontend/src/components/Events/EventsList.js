import React from "react";
import EventItem from "./EventItem";

const EventsList = props => {
  return (
    <ul className="events__list">
      <EventItem events={props.events} authUserId={props.authUserId} />
    </ul>
  );
};

export default EventsList;
