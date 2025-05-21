import { inputSchema } from './input-schema'
import { handler } from './handler'

export { inputSchema } from './input-schema'
export const name = 'list-dataflows'
export const description = 'List my Coupler.io data flows. Use this to get the ID (uuid format) of a data flow by its name.'

const annotations = {
  title: 'List Coupler.io data flows.',
  idempotentHint: true,
}

export const toolMapEntry = {
  name,
  description,
  inputSchema,
  handler,
}

export const toolListEntry = {
  name,
  description,
  inputSchema,
  annotations,
}
