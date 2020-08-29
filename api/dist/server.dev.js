"use strict";

var express = require("express");

var mongoose = require("mongoose");

var cors = require("cors");

var routes = require("./routes");

var app = express();
mongoose.connect("mongodb+srv://client:digivac@digivac-dsopc.gcp.mongodb.net/digivac?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); //cors sempre antes de routes!!!!
//nao esquecer de por:
//res.header("Access-Control-Allow-Origin", "*");
//res.header("Access-Control-Allow-Headers", "X-Requested-With");
//em todos os controllers

app.options('*', cors());
app.use(express.json());
app.use(routes);
app.listen(3000);