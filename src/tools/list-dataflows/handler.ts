import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

import { logger } from '@/logger'
import { textResponse } from '@/util/tool-response'
import { COUPLER_ACCESS_TOKEN } from '@/env'
import { CouplerioClient } from '@/lib/couplerio-client'

export const handler = async (): Promise<CallToolResult> => {
  const coupler = new CouplerioClient({ auth: COUPLER_ACCESS_TOKEN })
  const query = new URLSearchParams({ type: 'from_template' })

  const response = await coupler.request(`/dataflows?${query}`)

  if (!response.ok) {
    logger.error(`Failed to list dataflows. Response status: ${response.status}`)
    return textResponse({
      isError: true,
      text: `Failed to list data flows. Response status: ${response.status}`
    })
  }

  return textResponse({ text: await response.text() })
}
