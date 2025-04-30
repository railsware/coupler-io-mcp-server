import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

import { logger } from '@/logger'
import { errorResponse, textResponse } from '@/util/tool-response'

import { validateParams } from './validate-params'
import { FileManager } from '@/util/file-manager'

export const handler = async (params?: Record<string, unknown>): Promise<CallToolResult> => {
  validateParams(params)

  const dataflowId = params!.dataflowId as string

  const fileManager = new FileManager({ dataflowId })

  let schemaPath: string

  try {
    schemaPath = await fileManager.getFile('schema')
  } catch (e) {
    logger.error(`Failed to get dataflow schema file: ${e}`)
    return errorResponse(`Failed to get dataflow ${dataflowId} schema file: ${e}`)
  }

  const schema = await Bun.file(schemaPath).text()

  return textResponse(schema)
}
