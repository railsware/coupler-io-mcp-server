import { inputSchema } from './input-schema'
import { handler } from './handler'

export { inputSchema } from './input-schema'
export const name = 'get-data'
export const description = 'Get data from a Coupler.io data flow run'

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
