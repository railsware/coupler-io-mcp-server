import express from 'express'

import { PORT } from '@/env'
import { loggingMiddleware, logger } from '@/server/logging'
import { router as mcpRouter } from '@/server/transports/http/routes/mcp'
import { router as oauthRouter } from '@/server/transports/http/routes/oauth'

const app = express()

app.disable('x-powered-by')

app.use(express.json())
app.use(loggingMiddleware)

app.use('/mcp', mcpRouter)
app.use('/oauth', oauthRouter)

export const httpServer = {
  start() {
    app.listen(PORT, () => {
      logger.info(`Coupler.io MCP Server listening on port ${PORT}`)
    })
  }
}