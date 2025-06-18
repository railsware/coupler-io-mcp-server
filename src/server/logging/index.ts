import pino from 'pino'
import { createGcpLoggingPinoConfig } from '@google-cloud/pino-logging-gcp-config'
import pinoMiddleware from 'pino-http'

import { NODE_ENV, LOG_STDIO, LOG_LEVEL, TRANSPORT, APP_VERSION } from '@/env'

const SERVICE_NAME = 'coupler-io-mcp-server'

// "Spy" on STDIO and log to a file
;(() => {
  if (!LOG_STDIO || TRANSPORT !== 'stdio') return

  const originalStdoutWrite = process.stdout.write.bind(process.stdout)

  process.stdout.write = function(
    chunk: string | Uint8Array,
    encodingOrCallback?: BufferEncoding | ((err?: Error | null) => void),
    callback?: (err?: Error | null) => void
  ): boolean {
    logger.info(`[STDOUT]: ${chunk.toString()}`)
    if (typeof encodingOrCallback === 'function') {
      return originalStdoutWrite(chunk, encodingOrCallback)
    }

    return originalStdoutWrite(chunk, encodingOrCallback, callback)
  }

  process.stdin.on('data', (chunk: Buffer) => {
    logger.info(`[STDIN]: ${chunk.toString()}`)
  })
})()

const fileDestination = `log/${NODE_ENV}.log`
const fileTransport = {
  target: 'pino/file',
  options: { destination: fileDestination, mkdir: true },
}

const fileLogger = pino({
  level: LOG_LEVEL || 'info',
  transport: fileTransport,
})

const consoleLogger = pino(
  createGcpLoggingPinoConfig(
    {
      serviceContext: {
        service: SERVICE_NAME,
        version: APP_VERSION
      }
    },
    {
      level: LOG_LEVEL || 'info'
    }
  )
)

export const loggingMiddleware = pinoMiddleware({
  logger: consoleLogger
})

export const logger = TRANSPORT === 'stdio' ? fileLogger : consoleLogger