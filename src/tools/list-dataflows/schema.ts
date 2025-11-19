import z from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const inputSchema = zodToJsonSchema(z.object({}).strict())

const zodOutputSchema = z.object({
  dataflows: z.array(
    z.object({
      id: z.string().describe('The ID of the dataflow.'),
      name: z.string().describe('The name of the dataflow.'),
      last_successful_execution_id: z.string().nullish().describe('The ID of the last successful run (execution) of the dataflow.'),
      last_success_run_at: z.string().nullish().describe('The date and time of the last successful run (execution) of the dataflow. ISO 8601 format.'),
    })
  )
})

export const outputSchema = zodToJsonSchema(zodOutputSchema)
