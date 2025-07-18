import { pino } from 'pino'
import { LOG_STDIO, LOG_LEVEL, NODE_ENV } from '../env.js'

// "Spy" on STDIO and log to a file
;(() => {
  if (!LOG_STDIO) return

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

const prettyStdErrTransport = {
  target: 'pino-pretty',
  options: {
    destination: process.stderr.fd,
    colorize: true,
  }
}

const stdErrTransport = {
  target: 'pino/file',
  options: {
    destination: process.stderr.fd,
    colorize: false,
  }
}

const fileTransport = {
  target: 'pino/file',
  options: {
    destination: `log/${NODE_ENV}.log`,
    colorize: false,
    mkdir: true,
  },
}

const transportForNodeEnv = {
  development: prettyStdErrTransport,
  production: stdErrTransport,
  test: fileTransport,
}

// Logs to STDERR
export const logger = pino({
  level: LOG_LEVEL || 'info',
  transport: transportForNodeEnv[NODE_ENV]
})
