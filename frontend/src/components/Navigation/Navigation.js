import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import AutContext from "../../context/auth-context";
import "./Navigation.css";

function Navigation(props) {
  return (
    <AutContext.Consumer>
      {context => (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>EventBooking</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authentication</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Event</NavLink>
              </li>
              {context.token && (
                <Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}> Logout</button>
                  </li>
                </Fragment>
              )}
            </ul>
          </nav>
        </header>
      )}
    </AutContext.Consumer>
  );
}

export default Navigation;
