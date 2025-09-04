import dotenv from 'dotenv';

let cachedConfig = null;

export function loadConfig() {
  if (cachedConfig) return cachedConfig;
  dotenv.config();
  const cfg = Object.freeze({
    NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3995', 10),
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    VERSION: '0.1.0'
  });
  cachedConfig = cfg;
  return cfg;
}
