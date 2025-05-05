import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

import { logger } from '@/logger'
import { textResponse } from '@/util/tool-response'

import { validateParams } from './validate-params'
import { FileManager } from '@/tools/shared/file-manager'

type ColumnDefinition = {
  key: string,
  columnName?: string,
  label: string,
  schema: { type: string },
  typeOptions?: Record<string, unknown>,
}

export const handler = async (params?: Record<string, unknown>): Promise<CallToolResult> => {
  try {
    validateParams(params)
  } catch (e) {
    return textResponse({
      text: (e as Error).message,
      isError: true,
    })
  }

  const dataflowId = params!.dataflowId as string

  const fileManager = new FileManager({ dataflowId })

  let schemaPath: string

  try {
    schemaPath = await fileManager.getFile('schema')
  } catch (e) {
    logger.error(`Failed to get dataflow schema file: ${e}`)
    return textResponse({ text: `Failed to get dataflow ${dataflowId} schema file. ${e}`, isError: true })
  }

  const schema = await Bun.file(schemaPath).json()
  schema.columns.forEach((col: ColumnDefinition, index: number) => {
    col.columnName = `col_${index}`
  })

  return textResponse({ text: JSON.stringify(schema) })
}
