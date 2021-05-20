// this is server side logging
const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

const logDirectory = path.join(__dirname, '../', 'server_log');
const transport = new winston.transports.DailyRotateFile({
  filename: `${logDirectory}/application-%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
});

// timezone function winston calls to get timezone(ASIA/KOLKATA)

const timezoned = () => new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Kathmandu',
});

// options for logger object
const options = {
  file: {
    level: 'info',
    filename: `${logDirectory}/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// logger object with above defined options
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
    transport,
  ],
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: timezoned,
    }),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
    ),
  ),
  exitOnError: false,
});

// writing file
logger.stream = {
  write(message) {
    logger.info(message);
  },
};
// process.on('uncaughtException', (err) => {
//   logger.error('uncaughtException',
//     { message: err.message, stack: err.stack }); // logging with MetaData
//   // process.exit(1); // exit with failure
// });

// process.on('unhandledRejection', (err) => {
//   logger.error('uncaughtException', { message: err.message, stack: err.stack }); // logging })
// });

module.exports = logger;
