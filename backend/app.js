const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

/* mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB", error.message);
  }); */

app.use(express.static("build"));
app.use(express.json());

// Add routes here e.g
// app.use('/api/notices', noticeBoardRouter)

module.exports = app;
