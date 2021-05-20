const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const morgan = require('morgan');
const passportMiddleware = require('./passport');
const winstonLogging = require('./logging');
const ClientLogger = require('./clientSideLogging');

module.exports = (app) => {
  app.use(
    fileUpload({
      useTempFiles: true,
      safeFileNames: true,
      preserveExtension: true,
      tempFileDir: path.join(__dirname, '../public', 'files'),
    }),
  );

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(cors());

  app.use(bodyParser.json());

  // passport middleware config
  app.use(passport.initialize());
  passportMiddleware(passport);
  // Two log files are created in logs folder-->
  // 1.app.log with all the recent logs and,
  // 2.application- date.log with date wise logs of application

  // streamed with ist and utc
  app.use(morgan('combined', { stream: winstonLogging.stream }));
  app.use(morgan('combined', { stream: ClientLogger.stream }));
};
