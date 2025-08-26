import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const zodSchema = z.object({
  dataflowId: z
    .string()
    .min(1, 'dataflowId is required')
    .regex(/^\S+$/, 'dataflowId must not contain whitespace')
    .describe('The ID of the data flow with a successful run'),
  executionId: z
    .string()
    .min(1, 'executionId is required')
    .regex(/^\S+$/, 'executionId must be a non-empty string')
    .describe('The ID of the last successful run (execution) of the data flow.'),
}).strict()

export const inputSchema = zodToJsonSchema(zodSchema)

const zodOutputSchema = z.object({
  schema: z.object({
    columns: z.array(z.object({
      key: z.string(),
      label: z.string().describe('Human readable column label.'),
      columnName: z.string().describe('The actual column name in the SQLite database.'),
      schema: z.record(z.unknown()),
      typeOptions: z.record(z.unknown()).optional().describe('Additional options for the column type.'),
    }))
  })
})

export const outputSchema = zodToJsonSchema(zodOutputSchema)
