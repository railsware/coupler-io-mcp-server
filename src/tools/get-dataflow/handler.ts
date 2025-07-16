import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fromError } from 'zod-validation-error'

import { zodInputSchema } from './schema.js'

import { textResponse } from '#util/tool-response.js'
import { COUPLER_ACCESS_TOKEN } from '#env.js'
import { CouplerioClient } from '#lib/couplerio-client/index.js'

export const handler = async (params?: Record<string, unknown>): Promise<CallToolResult> => {
  const validationResult = zodInputSchema.safeParse(params)

  if (!validationResult.success) {
    const error = fromError(validationResult.error)
    console.error(`Invalid parameters for get-dataflow tool: ${error.toString()}`)

    return textResponse({
      text: `Invalid parameters for get-dataflow tool. ${error.toString()}`,
      isError: true,
    })
  }

  const coupler = new CouplerioClient({ auth: COUPLER_ACCESS_TOKEN })
  const response = await coupler.request('/dataflows/{dataflowId}{?type}', {
    expand: {
      dataflowId: validationResult.data.dataflowId,
      type: 'from_template'
    },
    request: {
      method: 'GET'
    }
  })

  if (!response.ok) {
    console.error(`Failed to get data flow ${validationResult.data.dataflowId}. Response status: ${response.status}`)
    return textResponse({
      isError: true,
      text: `Failed to get data flow ${validationResult.data.dataflowId}. Response status: ${response.status}`
    })
  }

  const dataflow = await response.json()

  return textResponse({ text: JSON.stringify(dataflow, null, 2), structuredContent: { dataflow } })
}
