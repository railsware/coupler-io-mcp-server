import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { rm } from 'node:fs/promises'
import Database from 'better-sqlite3'

import { handler } from './handler.js'
import { DOWNLOAD_DIR } from '#tools/shared/file-manager.js'

const createMockResponse = (responseFn: () => Promise<Response>): typeof fetch => {
  return responseFn
}

const mockFetch = vi.spyOn(global, 'fetch')

const db = new Database(':memory:')
db.exec('CREATE TABLE data (col_0 BLOB, col_1 BLOB);')
db.exec("INSERT INTO data (col_0, col_1) VALUES (1, 'Test');")
// Serialize the db to a buffer
const dbBuffer = db.serialize()
db.close()

// Set up default fetch mocks
const mockSignedUrl = createMockResponse(() =>
  Promise.resolve(new Response(
    JSON.stringify({ file: 'sqlite', url: 'https://example.org/data.sqlite' }),
    { status: 200 }
  ))
)

const mockSqliteFile = createMockResponse(() =>
  Promise.resolve(new Response(dbBuffer, {
    status: 200,
    headers: { 'Content-Type': 'application/octet-stream' }
  }))
)

describe('getData', () => {
  beforeEach(async () => {
    mockFetch.mockReset()
    await rm(DOWNLOAD_DIR, { recursive: true, force: true })
  })

  afterAll(() => {
    mockFetch.mockRestore()
  })

  it('returns query results', async () => {
    mockFetch
      .mockImplementationOnce(mockSignedUrl)
      .mockImplementationOnce(mockSqliteFile)

    const toolResult = await handler({
      dataflowId: 'test-dataflow-id',
      executionId: 'test-execution-id',
      query: 'SELECT * FROM data'
    })

    expect(toolResult).toEqual({
      isError: false,
      content: [{
        type: 'text',
        text: JSON.stringify([{ col_0: 1, col_1: 'Test' }], null, 2)
      }],
      structuredContent: {
        data: [{ col_0: 1, col_1: 'Test' }]
      }
    })
  })

  it('returns error when fetch for signed URL fails', async () => {
    mockFetch.mockImplementationOnce(createMockResponse(async () =>
      new Response('Error creating signed URL', { status: 500 })
    ))

    const toolResult = await handler({
      dataflowId: 'test-dataflow-id',
      executionId: 'test-execution-id',
      query: 'SELECT * FROM data'
    })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Failed to get data flow test-dataflow-id sqlite file. Error: Failed to get sqlite file signed URL for dataflow ID test-dataflow-id. Response status: 500'
      }]
    })
  })

  it('returns error when fetch for SQLite file fails', async () => {
    mockFetch.mockImplementationOnce(mockSignedUrl)
    mockFetch.mockImplementationOnce(createMockResponse(() =>
      Promise.resolve(new Response('Error fetching file', { status: 500 }))
    ))

    const toolResult = await handler({
      dataflowId: 'test-dataflow-id',
      executionId: 'test-execution-id',
      query: 'SELECT * FROM data'
    })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Failed to get data flow test-dataflow-id sqlite file. Error: Failed to download file. Response status: 500'
      }]
    })
  })

  it('returns error when query execution fails', async () => {
    mockFetch
      .mockImplementationOnce(mockSignedUrl)
      .mockImplementationOnce(mockSqliteFile)

    const toolResult = await handler({
      dataflowId: 'test-dataflow-id',
      executionId: 'test-execution-id',
      query: 'SELECT INVALID SQL QUERY'
    })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: expect.stringContaining('Failed to execute query')
      }]
    })
  })
})

describe('with invalid params', () => {
  it('returns errors on missing parameters', async () => {
    const toolResult = await handler()

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Invalid parameters for get-data tool. Validation error: Required'
      }]
    })
  })

  it('returns error on missing dataflowId', async () => {
    const toolResult = await handler({ query: 'SELECT * FROM data' })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Invalid parameters for get-data tool. Validation error: Required at "dataflowId"; Required at "executionId"'
      }]
    })
  })

  it('returns error on missing query', async () => {
    const toolResult = await handler({ dataflowId: 'test-dataflow-id', executionId: 'test-execution-id' })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Invalid parameters for get-data tool. Validation error: Required at "query"'
      }]
    })
  })

  it('returns error on invalid dataflowId', async () => {
    const toolResult = await handler({
      dataflowId: 123,
      executionId: true,
      query: 'SELECT * FROM data'
    })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Invalid parameters for get-data tool. Validation error: Expected string, received number at "dataflowId"; Expected string, received boolean at "executionId"'
      }]
    })
  })

  it('returns error on invalid query', async () => {
    const toolResult = await handler({
      dataflowId: 'test-dataflow-id',
      query: 123
    })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Invalid parameters for get-data tool. Validation error: Required at "executionId"; Expected string, received number at "query"'
      }]
    })
  })

  it('returns error on non-SELECT query', async () => {
    const toolResult = await handler({
      dataflowId: 'test-dataflow-id',
      executionId: 'test-execution-id',
      query: 'INSERT INTO data (col_0, col_1) VALUES (2, "Test 2")'
    })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Invalid parameters for get-data tool. Validation error: must start with "SELECT" at "query"'
      }]
    })
  })
})
