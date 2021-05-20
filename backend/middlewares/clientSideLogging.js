// this is server side logging
const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

const logDirectory = path.join(__dirname, '../', 'client_log');
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
  http: {
    handleExceptions: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// logger object with above defined options
const ClientLogger = winston.createLogger({
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
ClientLogger.remove(winston.transports.Http);

// writing file
ClientLogger.stream = {
  write(message) {
    ClientLogger.info(message);
  },
};
// process.on('uncaughtException', (err) => {
//   ClientLogger.error('uncaughtException',
//     { message: err.message, stack: err.stack }); // logging with MetaData
//   // process.exit(1); // exit with failure
// });

// process.on('unhandledRejection', (err) => {
//   ClientLogger.error('uncaughtException', { message: err.message, stack: err.stack }); })
// });

module.exports = ClientLogger;
