import { Database } from 'bun:sqlite'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

import { textResponse } from '@/util/tool-response'
import { FileManager } from '@/tools/shared/file-manager'

import { validateParams } from './validate-params'

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
  const query = params!.query as string

  const fileManager = new FileManager({ dataflowId })

  let sqlitePath: string
  try {
    sqlitePath = await fileManager.getFile('sqlite')
  } catch (e) {
    return textResponse({ text: `Failed to get data flow ${dataflowId} sqlite file. ${e}`, isError: true })
  }

  const db = new Database(sqlitePath)
  let queryResult
  try {
    queryResult = db.query(query).all()
  } catch (e) {
    return textResponse({ text: `Failed to execute query: ${e}`, isError: true })
  } finally {
    db.close(false)
  }

  return textResponse({ text: JSON.stringify(queryResult) })
}
