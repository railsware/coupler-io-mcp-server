import { parseEnv, z } from 'znv'

export const {
  COUPLER_API_HOST,
  STORAGE_HOST
} = parseEnv(process.env, {
    COUPLER_API_HOST: z.string().url().default('https://coupler.io'),
    STORAGE_HOST: z.string().url(),
  })
