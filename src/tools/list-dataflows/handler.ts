import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

import { textResponse } from '../../util/tool-response.js'
import { COUPLER_ACCESS_TOKEN } from '../../env.js'
import { CouplerioClient } from '../../lib/couplerio-client/index.js'
import { logger } from '../../logger/index.js'

export const handler = async (): Promise<CallToolResult> => {
  const coupler = new CouplerioClient({ auth: COUPLER_ACCESS_TOKEN })
  const query = new URLSearchParams({ type: 'from_template' })

  const response = await coupler.request(`/dataflows?${query}{?type}`)

  if (!response.ok) {
    logger.error(`Failed to list dataflows. Response status: ${response.status}`)
    return textResponse({
      isError: true,
      text: `Failed to list data flows. Response status: ${response.status}`
    })
  }

  const dataflows = await response.json()

  return textResponse({ text: JSON.stringify(dataflows, null, 2), structuredContent: { dataflows } })
}
