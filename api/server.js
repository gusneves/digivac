const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes");

const app = express();

mongoose.connect(
  "mongodb+srv://client:digivac@digivac-dsopc.gcp.mongodb.net/digivac?retryWrites=true&w=majority",
  { useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false 
  }
);
  
app.use(express.json());
app.use(routes);

app.listen(3000);