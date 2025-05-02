import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

// Import all tools here
import * as getData from '@/tools/get-data'

const TOOL_MAP = {
  [getData.name]: getData.toolMapEntry
}

export const server = new Server({
  name: 'Coupler.io MCP server',
  version: '0.0.1',
}, {
  capabilities: {
    tools: {},
    logging: {}
  }
})

// Look up the tool by name in TOOL_MAP and call its handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = TOOL_MAP[request.params.name as keyof typeof TOOL_MAP]
  if (!tool) {
    throw new Error(`Tool ${request.params.name} not found`)
  }

  return await tool.handler(request.params.arguments)
})

// List all tools
server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: [
      getData.toolListEntry
    ]
  })
)
