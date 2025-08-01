import { DatabaseSync as Database } from 'node:sqlite'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { fromError } from 'zod-validation-error'

import { textResponse } from '../../util/tool-response.js'
import { FileManager } from '../shared/file-manager.js'
import { logger } from '../../logger/index.js'

import { zodInputSchema } from './schema.js'

export const handler = async (params?: Record<string, unknown>): Promise<CallToolResult> => {
  const validationResult = zodInputSchema.safeParse(params)

  if (!validationResult.success) {
    const error = fromError(validationResult.error)
    logger.error(`Invalid parameters for get-data tool: ${error.toString()}`)

    return textResponse({
      text: `Invalid parameters for get-data tool. ${error.toString()}`,
      isError: true,
    })
  }

  const fileManager = new FileManager(validationResult.data)

  let sqlitePath: string
  try {
    sqlitePath = await fileManager.getFile('sqlite')
  } catch (e) {
    return textResponse({ text: `Failed to get data flow ${validationResult.data.dataflowId} sqlite file. ${e}`, isError: true })
  }

  const db = new Database(sqlitePath, { readOnly: true })
  let statement, queryResult
  try {
    statement = db.prepare(validationResult.data.query)
    queryResult = statement.all()
  } catch (e) {
    return textResponse({ text: `Failed to execute query: ${e}`, isError: true })
  } finally {
    db.close()
  }

  return textResponse({
    text: JSON.stringify(queryResult, null, 2),
    structuredContent: { data: queryResult }
  })
}
