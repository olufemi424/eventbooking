import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/commons/Spinner";

export class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBooking();
  }

  fetchBooking = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query{
            bookings{
              _id
              createdAt
              event{
                _id
                title
              }
            }
          }
        `
    };

    const token = this.context.token;
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "Application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        const { bookings } = resData.data;
        this.setState({ bookings });
        this.setState({ isLoading: false });
      })
      .catch(err => {
        console.error(`Error Fetching Event: ${err.message}`);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <div>
        <h2>This is booking</h2>
        {this.state.isLoading ? (
          <Spinner> </Spinner>
        ) : (
          <span>
            {this.state.bookings.map(booking => {
              const date = new Date(booking.createdAt).toLocaleDateString();
              return (
                <li key={booking._id}>
                  <span>
                    {booking.event.title} - {date}
                  </span>
                </li>
              );
            })}
          </span>
        )}
      </div>
    );
  }
}

export default Bookings;
