const authResolver = require("./auth");
const eventResolver = require("./events");
const bookingsResolver = require("./bookings");

const rootResolver = {
  ...authResolver,
  ...eventResolver,
  ...bookingsResolver
};

module.exports = rootResolver;
