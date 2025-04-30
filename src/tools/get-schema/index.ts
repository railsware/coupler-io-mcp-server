import { inputSchema } from './input-schema'
import { handler } from './handler'

export { inputSchema } from './input-schema'
export const name = 'get-schema'
export const description = 'Get data table schema from a Coupler.io data flow'

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
}
