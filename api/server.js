const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes");

const app = express();
app.use(express.json());

mongoose.connect(
  "mongodb+srv://client:digivac@digivac-dsopc.gcp.mongodb.net/digivac?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(routes);
app.listen(3000);