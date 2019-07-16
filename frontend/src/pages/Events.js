import React, { Component, Fragment } from "react";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";

export class Events extends Component {
  state = {
    creating: false
  };

  startCreatingEventHandler = () => {
    this.setState({ creating: true });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };
  modalConfirmHandler = () => {
    this.setState({ creating: false });
  };
  render() {
    return (
      <Fragment>
        <div className="events-control">
          <p>Share your own events</p>
          <button className="btn" onClick={this.startCreatingEventHandler}>
            Create Event
          </button>
        </div>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title={"Add Event"}
            canCancel
            canConfirm
            onConfirm={this.modalConfirmHandler}
            onCancel={this.modalCancelHandler}
          >
            Modal Content
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default Events;
