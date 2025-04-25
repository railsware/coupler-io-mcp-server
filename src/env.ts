import { parseEnv, z } from 'znv'

export const {
  COUPLER_API_HOST,
  STORAGE_HOST,
  COUPLER_ACCESS_TOKEN
} = parseEnv(process.env, {
    COUPLER_API_HOST: z.string().url().default('https://api.coupler.io'),
    STORAGE_HOST: z.string().url(),
    COUPLER_ACCESS_TOKEN: z.string()
  })
