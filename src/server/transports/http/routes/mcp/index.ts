import { Router } from 'express'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

import { server } from '@/server/index'
import { logger } from '@/server/logging'
import { authorize } from '@/server/transports/http/middleware/authorize'

const methodNotAllowedResponse = {
  jsonrpc: '2.0',
  error: {
    code: -32000,
    message: 'Method not allowed.'
  },
}

const router = Router()

router.use(authorize)

router.post('/', async (req, res) => {
  try {
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    })

    res.on('close', () => {
      transport.close()
      server.close()
    })

    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    logger.error('Error handling MCP request:', error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      })
    }
  }
})

router.use((req, res) => {
  if (req.method != 'POST') {
    res.status(405).json(methodNotAllowedResponse)
  }
})

export { router }