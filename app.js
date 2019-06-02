const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

//set up express
const app = express();

const events = [];

//body parser
app.use(bodyParser.json());

//handling query being sent using the grapghql pkg
app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
      type Event {
         _id: ID!
         title: String!
         description: String!
         price: Float!
         date: String!
      }

      input EventInput {
         title: String!
         description: String!
         price: Float!
         date: String!
      }

      type RootQuery {
         events: [Event!]!
      }

      type RootMutation {
         createEvent(eventInput: EventInput): Event
      }

      schema {
         query: RootQuery
         mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        const rqEvents = [...events];
        return rqEvents;
      },
      createEvent: args => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date().toISOString()
        };
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

//set up server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`localhost:${PORT}/graphql`);
});
