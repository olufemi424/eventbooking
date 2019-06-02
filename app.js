const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/events");

//set up express
const app = express();

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
        return Event.find({})
          .then(events => {
            return events.map(event => {
              return { ...event._doc, _id: event.id };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });

        return event
          .save()
          .then(result => {
            return { ...result._doc, _id: result.id };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
        return event;
      }
    },
    graphiql: true
  })
);

//set up server and db
const PORT = 3000;
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-yzj5q.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(PORT);
    console.log(`localhost:${PORT}/graphql`);
    console.log(`mongodb connect`);
  })
  .catch(err => console.log(err));
