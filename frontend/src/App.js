import React, { Component, Fragment } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthContext from "./context/auth-context";

//pages
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";

//components
import Navigation from "./components/Navigation/Navigation";

import "./App.css";

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <Navigation />
            <main className="main-content">
              <Switch>
                <Redirect from="/" to="/auth" exact />
                <Route path="/events" component={Events} />
                {this.state.token && (
                  <Route path="/bookings" component={Bookings} />
                )}
                {this.state.token && <Redirect from="/auth" to="/events" />}
                {!this.state.token && (
                  <Route path="/bookings" component={Auth} />
                )}
                {!this.state.token && <Route path="/auth" component={Auth} />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
