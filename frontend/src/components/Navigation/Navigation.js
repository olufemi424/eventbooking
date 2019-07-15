import React from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EventBooking</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/auth">Authentication</NavLink>
          </li>
          <li>
            <NavLink to="/events">Event</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
