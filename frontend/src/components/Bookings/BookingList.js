import React from "react";

const BookingList = props => (
  <ul className="bookings__list">
    {props.bookings.map(booking => {
      const date = new Date(booking.createdAt).toLocaleDateString();
      return (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            {booking.event.title} - {date}
          </div>
          <div className="bookings__item-action">
            <button className="btn" onClick={() => props.onDelete(booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default BookingList;
