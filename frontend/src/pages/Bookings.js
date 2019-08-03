import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/commons/Spinner";
import BookingList from "../components/Bookings/BookingList";

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

  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          mutation CancelBooking($id:ID!){
            cancelBooking(bookingId: $id){
              _id
              title
            }
          }
        `,
      variables: {
        id: bookingId
      }
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
        this.setState(prevState => {
          const updatedBooking = prevState.bookings.filter(booking => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBooking, isLoading: false };
        });
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
        {this.state.isLoading ? (
          <Spinner> </Spinner>
        ) : (
          <BookingList
            bookings={this.state.bookings}
            onDelete={this.deleteBookingHandler}
          />
        )}
      </div>
    );
  }
}

export default Bookings;
