import React, { Component, Fragment } from "react";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventsList";

export class Events extends Component {
  state = {
    creating: false,
    events: []
  };

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchEvents();
  }

  startCreatingEventHandler = () => {
    this.setState({ creating: true });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };
  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    // const event = { title, price, date, description };

    const token = this.context.token;

    const requestBody = {
      query: `
          mutation{
            createEvent(eventInput: {title: "${title}", price:${price}, date:"${date}" description:"${description}"}){
              _id
              title
              description
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

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
        console.log(resData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchEvents = () => {
    const requestBody = {
      query: `
          query{
            events{
              _id
              title
              description
              price
              creator{
                _id
              }
            }
          }
        `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "Application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        const { events } = resData.data;
        this.setState({ events });
      })
      .catch(err => {
        console.error(`Error Fetching Event: ${err.message}`);
      });
  };

  render() {
    return (
      <Fragment>
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events</p>
            <button className="btn" onClick={this.startCreatingEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title={"Add Event"}
            canCancel
            canConfirm
            onConfirm={this.modalConfirmHandler}
            onCancel={this.modalCancelHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="date" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        <EventList
          events={this.state.events}
          authUserId={this.context.userId}
        />
      </Fragment>
    );
  }
}

export default Events;
