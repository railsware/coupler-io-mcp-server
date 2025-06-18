import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { server } from '@/server/index'
import { logger } from '@/server/logging'

export const stdioServer = {
  start() {
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
}


