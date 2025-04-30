import { Database } from 'bun:sqlite'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

import { errorResponse, textResponse } from '@/util/tool-response'
import { FileManager } from '@/util/file-manager'

import { validateParams } from './validate-params'

export const handler = async (params?: Record<string, unknown>): Promise<CallToolResult> => {
  validateParams(params)

  const dataflowId = params!.dataflowId as string
  const query = params!.query as string

  const fileManager = new FileManager({ dataflowId })

  let sqlitePath: string
  try {
    sqlitePath = await fileManager.getFile('sqlite')
  } catch (e) {
    return errorResponse(`Failed to get data flow ${dataflowId} sqlite file: ${e}`)
  }

  const db = new Database(sqlitePath)
  let queryResult
  try {
    queryResult = db.query(query).get()
  } catch (e) {
    return errorResponse(`Failed to execute query: ${e}`)
  } finally {
    db.close(false)
  }

  return textResponse(JSON.stringify(queryResult, null, 2))
}
