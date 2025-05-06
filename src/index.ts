import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { server } from '@/server'
import { logger } from '@/logger'

const main = () => {
  const transport = new StdioServerTransport()
  server.connect(transport)
    .then(() => {
      logger.info('Coupler.io MCP Server started')
      server.sendLoggingMessage({ level: 'info', data: 'Coupler.io MCP Server started' })
    })
    .catch((e) => {
      logger.error('Fatal error: ', e)
      process.exit(1)
    })
}

main()
