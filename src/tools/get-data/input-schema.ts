export const inputSchema = {
  type: 'object',
  properties: {
    dataflowId: {
      type: 'string',
      description: 'The ID of the data flow with a successful run',
      pattern: '^\\S+'
    },
    query: {
      type: 'string',
      description: 'The SQL query to run on the data flow sqlite file',
      pattern: '^SELECT.*?'
    }
  },
  required: ['dataflowId', 'query'],
}
