import { afterAll, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { rm } from 'node:fs/promises'
import { Database } from 'bun:sqlite'

import { handler } from './handler'
import { DOWNLOAD_DIR } from '../shared/file-manager'

// Helper to create mock responses that match fetch's type signature
const createMockResponse = (responseFn: () => Promise<Response>): typeof fetch => {
  // Bun extends fetch API with this preconnect function.
  return Object.assign(responseFn, { preconnect: () => {} })
}

const mockFetch = spyOn(global, 'fetch')

const db = new Database(':memory:')
db.exec('CREATE TABLE data (col_0 BLOB, col_1 BLOB)')
db.exec('INSERT INTO data (col_0, col_1) VALUES (1, "Test")')
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
      query: 'SELECT * FROM data'
    })

    expect(toolResult).toEqual({
      isError: false,
      content: [{
        type: 'text',
        text: JSON.stringify([{ col_0: 1, col_1: 'Test' }])
      }]
    })
  })

  it('returns error when fetch for signed URL fails', async () => {
    mockFetch.mockImplementationOnce(createMockResponse(async () =>
      new Response('Error creating signed URL', { status: 500 })
    ))

    const toolResult = await handler({
      dataflowId: 'test-dataflow-id',
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
        text: 'This tool requires parameters'
      }]
    })
  })

  it('returns error on missing dataflowId', async () => {
    const toolResult = await handler({ query: 'SELECT * FROM data' })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Missing or invalid required parameter: dataflowId must be a non-empty string'
      }]
    })
  })

  it('returns error on missing query', async () => {
    const toolResult = await handler({ dataflowId: 'test-dataflow-id' })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Missing or invalid required parameter: query must be a non-empty string'
      }]
    })
  })

  it('returns error on invalid dataflowId', async () => {
    const toolResult = await handler({
      dataflowId: 123,
      query: 'SELECT * FROM data'
    })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Missing or invalid required parameter: dataflowId must be a non-empty string'
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
        text: 'Missing or invalid required parameter: query must be a non-empty string'
      }]
    })
  })

  it('returns error on non-SELECT query', async () => {
    const toolResult = await handler({
      dataflowId: 'test-dataflow-id',
      query: 'INSERT INTO data (col_0, col_1) VALUES (2, "Test 2")'
    })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Missing or invalid required parameter: query must start with SELECT'
      }]
    })
  })
})
