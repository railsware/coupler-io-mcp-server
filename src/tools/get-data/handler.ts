import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export const handler = async (params: Record<string, unknown> | undefined): Promise<CallToolResult> => {
  if (!params) {
    throw new Error('This tool requires parameters')
  }

  if (!params.dataflow_id || typeof params.dataflow_id !== 'string' || params.dataflow_id.trim() === '') {
    throw new Error('Missing or invalid required parameter: dataflow_id must be a non-empty string')
  }

  return {
    content: [
      {
        type: 'text',
        text: `Data for dataflow ID ${params.dataflow_id}`,
      }
    ]
  }
}
