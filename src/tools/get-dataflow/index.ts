import { inputSchema, outputSchema } from './schema.js'

export { handler } from './handler.js'

export const name = 'get-dataflow'
export const description = 'Get a Coupler.io data flow by ID.'

const annotations = {
  title: 'Get a Coupler.io data flow by ID.'
}

export const toolListEntry = {
  name,
  description,
  inputSchema,
  outputSchema,
  annotations,
}
