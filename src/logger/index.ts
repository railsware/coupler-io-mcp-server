import pino from 'pino'
import { NODE_ENV, LOG_STDIO, LOG_LEVEL } from '@/env'

// "Spy" on STDIO and log to a file
;(() => {
  if (!LOG_STDIO) return

  const originalStdoutWrite = process.stdout.write.bind(process.stdout)

  process.stdout.write = function(
    chunk: string | Uint8Array,
    encodingOrCallback?: BufferEncoding | ((err?: Error) => void),
    callback?: (err?: Error) => void
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

export const logger = pino({
  level: LOG_LEVEL || 'info',
  transport: {
    target: 'pino/file',
    options: { destination: fileDestination, mkdir: true },
  },
})
