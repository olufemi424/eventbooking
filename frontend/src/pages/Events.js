import React, { Component, Fragment } from "react";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventsList";
import Spinner from "../components/commons/Spinner";

export class Events extends Component {
  state = {
    creating: false,
    events: [],
    loading: false,
    selectedEvent: ""
  };
  isActive = true;

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
    // this.bookEventHandle()
  };

  modalCancelHandler = () => {
    if (this.isActive) {
      this.setState({ creating: false, selectedEvent: null });
    }
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
        this.setState(prevState => {
          const updatedEvent = [...prevState.events];
          updatedEvent.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            price: resData.data.createEvent.price,
            creator: {
              _id: this.context.userId
            }
          });
          return { events: updatedEvent };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchEvents = () => {
    this.setState({ loading: true });
    const requestBody = {
      query: `
          query{
            events{
              _id
              title
              description
              price
              date
              creator{
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
        if (this.isActive) {
          this.setState({ events, loading: false });
        }
      })
      .catch(err => {
        console.error(`Error Fetching Event: ${err.message}`);
        this.setState({ loading: false });
      });
  };

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      query: `
          mutation{
            bookEvent(eventId: "${this.state.selectedEvent._id}"){
              _id
              createdAt
              updatedAt
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
        if (this.isActive) {
          this.setState({ selectedEvent: null });
        }
      })
      .catch(err => {
        console.error(`Error Booking Event: ${err.message}`);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

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
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title={"Add Event"}
            canCancel
            canConfirm
            onConfirm={this.modalConfirmHandler}
            onCancel={this.modalCancelHandler}
            buttonText="Confirm"
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
        {this.state.selectedEvent && (
          <Modal
            title={"Add Event"}
            canCancel
            canConfirm
            onConfirm={this.bookEventHandler}
            onCancel={this.modalCancelHandler}
            buttonText={this.context.token ? "Book Event" : "Confirm"}
          >
            <h1> {this.state.selectedEvent.title}</h1>
            <h2>
              $ {this.state.selectedEvent.price} -{" "}
              {this.state.selectedEvent.date}{" "}
            </h2>
          </Modal>
        )}
        {this.state.loading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </Fragment>
    );
  }
}

export default Events;
