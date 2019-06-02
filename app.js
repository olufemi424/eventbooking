const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

//set up express
const app = express();

//body parser
app.use(bodyParser.json());

//handling query being sent using the grapghql pkg
app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
      type RootQuery {
         events: [String!]!
      }

      type RootMutation {
         createEvent(name: String): String
      }

      schema {
         query: RootQuery
         mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return ["Romantic", "Cooking", "Sailing", "All night coding"];
      },
      createEvent: args => {
        const eventName = args.name;
        return eventName;
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
