import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

// Import all tools here
import * as getData from '@/tools/get-data'
import * as getSchema from '@/tools/get-schema'
import * as listDataflows from '@/tools/list-dataflows'
import * as getDatadlow from '@/tools/get-dataflow'

const TOOL_MAP = {
  [getData.name]: getData.handler,
  [getSchema.name]: getSchema.handler,
  [listDataflows.name]: listDataflows.handler,
  [getDatadlow.name]: getDatadlow.handler,
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
  const handler = TOOL_MAP[request.params.name as keyof typeof TOOL_MAP]
  if (!handler) {
    throw new Error(`Handler for tool "${request.params.name}" not found`)
  }

  return await handler(request.params.arguments)
})

// List all tools
server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: [
      getData.toolListEntry,
      getSchema.toolListEntry,
      listDataflows.toolListEntry,
      getDatadlow.toolListEntry,
    ]
  })
)
