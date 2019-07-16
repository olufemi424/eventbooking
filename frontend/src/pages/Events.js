import React, { Component, Fragment } from "react";
import Modal from "../components/modal/Modal";

export class Events extends Component {
  render() {
    return (
      <Fragment>
        <div className="events-control">
          <p>Share your own events</p>
          <button className="btn">Create Event</button>
        </div>
        <Modal title={"Add Event"} canCancel canConfirm>
          Modal Content
        </Modal>
      </Fragment>
    );
  }
}

export default Events;
