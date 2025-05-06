export const inputSchema = {
  type: 'object',
  properties: {
    dataflowId: {
      type: 'string',
      description: 'The ID of the data flow with a successful run',
      pattern: '^\\S+'
    }
  },
  required: ['dataflowId'],
}
