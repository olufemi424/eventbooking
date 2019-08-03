import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/commons/Spinner";
import BookingList from "../components/Bookings/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart";

export class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "list"
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
                price
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

  changeOutputTypeHandler = outputType => {
    if (outputType === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };
  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <>
          <div className="bookings__control">
            <button
              className={this.state.outputType === "list" ? "active" : ""}
              onClick={() => this.changeOutputTypeHandler("list")}
            >
              List
            </button>
            <button
              className={this.state.outputType === "chart" ? "active" : ""}
              onClick={() => this.changeOutputTypeHandler("chart")}
            >
              Chart
            </button>
          </div>
          <div>
            {this.state.outputType === "list" ? (
              <BookingList
                bookings={this.state.bookings}
                onDelete={this.deleteBookingHandler}
              />
            ) : (
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </>
      );
    }

    return <div>{content}</div>;
  }
}

export default Bookings;
