const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const grapghqlSchema = require("./graphql/schema/index");
const grapghqlResolvers = require("./graphql/resolvers/index");

//middleware
const isAuth = require("./middleware/is-auth");

//set up express
const app = express();

//CORS ERROR HANDLING
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authoriztion");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

//body parser
app.use(bodyParser.json());

app.use(isAuth);

//handling query being sent using the grapghql pkg
app.use(
  "/graphql",
  graphqlHttp({
    schema: grapghqlSchema,
    rootValue: grapghqlResolvers,
    graphiql: true
  })
);

//set up server and db
const PORT = 8000;
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
