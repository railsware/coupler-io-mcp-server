export const inputSchema = {
  type: 'object',
  properties: {
    dataflow_id: {
      type: 'string',
      description: 'The ID of the dataflow with a successful run',
    },
  },
  required: ['dataflow_id'],
}
