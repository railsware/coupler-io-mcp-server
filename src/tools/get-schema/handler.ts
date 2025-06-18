import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { readFileSync } from 'fs'
import { fromError } from 'zod-validation-error'

import { logger } from '@/server/logging'
import { textResponse } from '@/util/tool-response'

import { FileManager } from '@/tools/shared/file-manager'

import { zodSchema } from './schema'

type ColumnDefinition = {
  key: string,
  columnName?: string,
  label: string,
  schema: { type: string },
  typeOptions?: Record<string, unknown>,
}

export const handler = async (params?: Record<string, unknown>): Promise<CallToolResult> => {
  const validationResult = zodSchema.safeParse(params)

  if (!validationResult.success) {
    const error = fromError(validationResult.error)
    logger.error(`Invalid parameters for get-schema tool: ${error.toString()}`)

    return textResponse({
      text: `Invalid parameters for get-schema tool. ${error.toString()}`,
      isError: true,
    })
  }

  const fileManager = new FileManager(validationResult.data)

  let schemaPath: string

  try {
    schemaPath = await fileManager.getFile('schema')
  } catch (e) {
    logger.error(`Failed to get dataflow schema file: ${e}`)
    return textResponse({ text: `Failed to get dataflow ${validationResult.data.dataflowId} schema file. ${e}`, isError: true })
  }

  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'))
  schema.columns.forEach((col: ColumnDefinition, index: number) => {
    col.columnName = `col_${index}`
  })

  return textResponse({ text: JSON.stringify(schema, null, 2), structuredContent: { schema } })
}
