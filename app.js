require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 3001;

//Api security

app.use(helmet());

//handle cors error

app.use(cors());

//MongoDb Connection setup
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);
if (process.env.NODE_ENV !== "production") {
  const mDb = mongoose.connection;
  mDb.on("open", () => {
    console.log("MongoDb is connected");
  });

  mDb.on("error", (error) => {
    console.log("error");
  });
  //logger

  app.use(morgan("tiny"));
}

//Set bodyParser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Load Routers
const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");
//Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

//Error Handler
const handleError = require("./src/utils/errorHandler");
app.use("*", (req, res) => {
  const error = new Error("resources not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
