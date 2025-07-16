import { parseEnv, z } from 'znv'

const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] as const
const ENVS = ['development', 'test', 'production'] as const

export const {
  COUPLER_API_HOST,
  COUPLER_ACCESS_TOKEN,
  LOG_STDIO,
  LOG_LEVEL,
  NODE_ENV,
  APP_VERSION
} = parseEnv(process.env, {
    COUPLER_API_HOST: z.string().url().default('https://app.coupler.io/mcp'),
    COUPLER_ACCESS_TOKEN: z.string().trim().min(1),
    LOG_STDIO: z.boolean().default(false),
    LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),
    NODE_ENV: z.enum(ENVS).default('development'),
    APP_VERSION: z.string().trim().min(1).default('development')
  })
