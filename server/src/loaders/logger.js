import pino from 'pino';
import { loadConfig } from '../config/index.js';

const config = loadConfig();

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: config.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: { translateTime: 'SYS:standard', ignore: 'pid,hostname' }
  } : undefined
});
