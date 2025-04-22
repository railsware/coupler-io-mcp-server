import { Database } from 'bun:sqlite'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { validateParams } from './validate-params'
import { getData } from '@/lib/couplerio-sdk/dataflows/get-data'
import { server } from '@/server/index.js'

export const handler = async (params: Record<string, unknown> | undefined): Promise<CallToolResult> => {
  validateParams(params)

  const dataflowId = params!.dataflowId as string
  const query = params!.query as string

  const dbFilePath = await getData({ dataflowId })
  console.error(`Database file path: ${dbFilePath}`)
  const db = new Database(dbFilePath)
  let queryResult
  try {
    queryResult = db.query(query).get()
  } finally {
    db.close(false)
  }

  console.error(`Query result: ${JSON.stringify(queryResult)}`)

  server.sendLoggingMessage({ level: 'debug', data: queryResult })

  return {
    content: [
      {
        type: 'text',
        text: `The file is at /tmp/dataflows/${dataflowId}.sqlite. Data: ${JSON.stringify(queryResult, null, 2)}`,
      }
    ]
  }
}
