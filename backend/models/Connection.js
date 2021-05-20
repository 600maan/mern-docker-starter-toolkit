/* eslint-disable no-console */
const mongoose = require('mongoose');
const logger = require('../middlewares/logging');

const connectDB = () => mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.info('connected to database.'))
  .catch((error) => logger.error(error));

const closeDB = () => mongoose.connection
  .close()
  .then(() => console.info('Connection Disconnected'))
  .catch((error) => logger.error(error));

module.exports = { connectDB, closeDB };
