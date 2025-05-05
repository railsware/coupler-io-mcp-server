import { inputSchema } from './input-schema'
import { handler } from './handler'

export { inputSchema } from './input-schema'
export const name = 'get-data'
export const description = 'Get data from a Coupler.io data flow run. Make sure to first query a sample of 5 rows from `data` table, e.g. `SELECT * from data LIMIT 5`, and then run the `get-schema` tool, to better understand the structure. The `get-schema` tool will return the JSON-encoded schema of the `data` table. When visualizing the data, do not try to reference any files, just generate a static page and use the data you get from the tools.'

const annotations = {
  title: 'Get and query data from a Coupler.io data flow.',
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
