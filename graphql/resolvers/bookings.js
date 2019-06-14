const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./mergeData");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find({});
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "5cf33f8b352cda73383c8f20",
      event: fetchedEvent
    });

    const result = await booking.save();
    return transformBooking(result);
  },

  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteMany({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
