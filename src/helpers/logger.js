import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, label, printf } = format;
import config from '../config/appConfig.cjs'
const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: config.app.name }),
    timestamp(),
    logFormat
  ),
  transports: [
    //new transports.Console(),
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YY-MM',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '1m'
    })
  ]
});

export default logger;
