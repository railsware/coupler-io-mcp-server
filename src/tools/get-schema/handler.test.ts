import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { rm } from 'node:fs/promises'

import { DOWNLOAD_DIR } from '@/tools/shared/file-manager'
import { handler } from './handler'

const createMockResponse = (responseFn: () => Promise<Response>): typeof fetch => {
  return responseFn
}

const mockSchema = {
  columns: [
    { key: 'col_0', label: 'Column 1', schema: { type: 'string' } },
    { key: 'col_1', label: 'Column 2', schema: { type: 'number' } },
  ]
}

// Response mocks
const mockCreateSignedUrl = createMockResponse(
  async () => new Response(
    JSON.stringify({ file: 'schema', url: 'https://example.com/schema.json' })
  )
)
const mockGetSchemaFile = createMockResponse(
  async () => new Response(JSON.stringify(mockSchema), { status: 200 })
)
const mockGetSchemaFileError = createMockResponse(
  async () => new Response('Error fetching schema file', { status: 500 })
)
const mockCreateSignedUrlError = createMockResponse(
  async () => new Response('Error creating signed URL', { status: 500 })
)

const mockFetch = vi.spyOn(globalThis, 'fetch')

describe('getSchema', () => {
  beforeEach(async () => {
    await rm(DOWNLOAD_DIR, { recursive: true, force: true })
    mockFetch.mockReset()
  })

  afterAll(async () => {
    mockFetch.mockRestore()
  })

  it('adds columnName-s and returns schema', async () => {
    mockFetch
      .mockImplementationOnce(mockCreateSignedUrl)
      .mockImplementationOnce(mockGetSchemaFile)

    const toolResult = await handler({ dataflowId: 'test-dataflow-id', executionId: 'test-execution-id' })

    expect(toolResult).toEqual({
      isError: false,
      content: [{
        type: 'text',
        text: JSON.stringify({
          columns: [
            { key: 'col_0', label: 'Column 1', schema: { type: 'string' }, columnName: 'col_0' },
            { key: 'col_1', label: 'Column 2', schema: { type: 'number' }, columnName: 'col_1' },
          ]
        }),
      }]
    })
  })

  describe('with error when creating signed URL', () => {
    it('returns error message', async () => {
      mockFetch
        .mockImplementationOnce(mockCreateSignedUrlError)
        .mockImplementationOnce(mockGetSchemaFile)

      const toolResult = await handler({ dataflowId: 'test-dataflow-id', executionId: 'test-execution-id' })

      expect(toolResult).toEqual({
        isError: true,
        content: [{
          type: 'text',
          text: 'Failed to get dataflow test-dataflow-id schema file. Error: Failed to get schema file signed URL for dataflow ID test-dataflow-id. Response status: 500',
        }]
      })
    })
  })

  describe('with error when fetching the schema file', () => {
    it('returns error message', async () => {
      mockFetch
        .mockImplementationOnce(mockCreateSignedUrl)
        .mockImplementationOnce(mockGetSchemaFileError)

      const toolResult = await handler({ dataflowId: 'test-dataflow-id', executionId: 'test-execution-id' })

      expect(toolResult).toEqual({
        isError: true,
        content: [{
          type: 'text',
          text: 'Failed to get dataflow test-dataflow-id schema file. Error: Failed to download file. Response status: 500',
        }]
      })
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
        text: 'Invalid parameters for get-schema tool. Validation error: Required',
      }]
    })
  })

  it('returns error on missing dataflowId', async () => {
    const toolResult = await handler({})

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Invalid parameters for get-schema tool. Validation error: Required at "dataflowId"; Required at "executionId"',
      }]
    })
  })

  it('returns error on invalid dataflowId', async () => {
    const toolResult = await handler({ dataflowId: 123, executionId: true })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Invalid parameters for get-schema tool. Validation error: Expected string, received number at "dataflowId"; Expected string, received boolean at "executionId"',
      }]
    })
  })
})
