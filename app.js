const express = require("express");
const bodyParser = require("body-parser");

//set up express
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

//set up server
const PORT = 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
