export const inputSchema = {
  type: 'object',
  properties: {
    dataflowId: {
      type: 'string',
      description: 'The ID of the dataflow with a successful run',
      pattern: '^\\S+'
    },
    query: {
      type: 'string',
      description: 'The SQL query to run on the dataflow database',
      pattern: '^SELECT.*?'
    }
  },
  required: ['dataflowId', 'query'],
}
