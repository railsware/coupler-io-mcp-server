import { inputSchema } from './input-schema'
import { handler } from './handler'

export { inputSchema } from './input-schema'
export const name = 'get-schema'
export const description = 'Get data table schema from a Coupler.io data flow. Get column names from `columnName` properties in column definitions. Example: {"columns":[{"key":"Row Updated At.0","label":"Row Updated At","schema":{"type":"string"},"typeOptions":{},"columnName":"col_0"},{"key":"Dimension: Source.0","label":"Dimension: Source","schema":{"type":"string"},"typeOptions":{},"columnName":"col_1"}]}. Here the columns are `col_0` and `col_1`.'

const annotations = {
  title: 'Get data schema from a Coupler.io data flow.',
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
