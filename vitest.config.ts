import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  test: {
    // Load .env.{mode} files in cwd. Load all env vars, not just the ones starting with VITE_.
    env: loadEnv(mode, process.cwd(), ''),
  }
}))
