import React, { Fragment } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

//pages
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";

//components
import Navigation from "./components/Navigation/Navigation";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <Navigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={Auth} />
            <Route path="/events" component={Events} />
            <Route path="/bookings" component={Bookings} />
          </Switch>
        </main>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
