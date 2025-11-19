import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const zodInputSchema = z.object({
  dataflowId: z.string()
    .min(1, 'dataflowId is required.')
    .regex(/^\S+$/, 'dataflowId must not be empty.')
    .describe('The ID of the data flow with a successful run.')
}).strict()

export const inputSchema = zodToJsonSchema(zodInputSchema)

const zodOutputSchema = z.object({
  dataflow: z.object({
    id: z.string().describe('The ID of the data flow.'),
    name: z.string().describe('The name of the data flow.'),
    last_successful_execution_id: z.string().describe('The ID of the last successful run (execution) of the data flow.'),
    schedule: z.string().nullish().describe('The schedule of the data flow. Crontab format.'),
    sources: z.array(z.object({
      id: z.string().describe('The ID of the source.'),
      name: z.string().describe('The name of the source.'),
      type: z.string().describe('The type of the source.'),
      params_configured: z.boolean().describe('Whether the source params are configured.'),
      enabled: z.boolean().describe('Whether the source is enabled.'),
      data_connections_count: z.number().int().nonnegative().describe('The number of data connections for the source.'),
      last_success_run_at: z.string().nullish().describe('The date and time of the last successful run of the source. ISO 8601 format.'),
      error_details: z.string().nullish().describe('The error details of the source.'),
    })).describe('The sources of the data flow.'),
  })
})

export const outputSchema = zodToJsonSchema(zodOutputSchema)
