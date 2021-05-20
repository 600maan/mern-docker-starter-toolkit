/* eslint no-console: ["error", { allow: ["log", "error"] }] */

// import npm modules
const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middlewares/logging');

dotenv.config();

// import local modules
const mongoose = require('./models/Connection');

mongoose.connectDB();
// define global variables
const app = express();
let PORT;
try {
  PORT = process.env.PORT;
} catch (error) {
  logger.error(error);
  console.log('Make sure to setup .env file properly');
}

// middlewares
require('./middlewares/middlewares')(app);

// routes
require('./routes')(app); // all routes

// booted up the server
app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Server is up @ ${PORT} port.`);
  return false;
});
