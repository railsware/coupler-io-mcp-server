import z from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

export const inputSchema = zodToJsonSchema(z.object({}).strict())

const zodOutputSchema = z.object({
  dataflows: z.array(
    z.object({
      id: z.string().describe('The ID of the dataflow.'),
      name: z.string().describe('The name of the dataflow.'),
      last_successful_execution_id: z.string().describe('The ID of the last successful run (execution) of the dataflow.')
    }).strict()
  )
})

export const outputSchema = zodToJsonSchema(zodOutputSchema)