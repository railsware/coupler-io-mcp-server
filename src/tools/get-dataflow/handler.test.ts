import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { handler } from './handler.js'

const createMockResponse = (responseFn: () => Promise<Response>): typeof fetch => {
  return responseFn
}

const mockResponse = {
  id: 'gsheet_dataflow',
  name: 'GSheet data flow',
  last_successful_execution_id: '11'
}

// Response mocks
const mockGetDataflow = createMockResponse(
  async () => new Response(
    JSON.stringify(mockResponse)
  )
)

const mockGetDataflowError = createMockResponse(
  async () => new Response('Error when getting dataflow', { status: 500 })
)

const mockGetDataflowErrorWithDetails = createMockResponse(
  async () => new Response(JSON.stringify({ error: { message: 'Test error message' } }), { status: 500 })
) 

const mockFetch = vi.spyOn(globalThis, 'fetch')

describe('get-dataflow', () => {
  beforeEach(async () => {
    mockFetch.mockReset()
  })

  afterAll(async () => {
    mockFetch.mockRestore()
  })

  it('returns data flow', async () => {
    mockFetch
      .mockImplementationOnce(mockGetDataflow)

    const toolResult = await handler({ dataflowId: 'gsheet_dataflow' })

    expect(toolResult).toEqual({
      isError: false,
      content: [{
        type: 'text',
        text: JSON.stringify(mockResponse, null, 2),
      }],
      structuredContent: {
        dataflow: mockResponse
      },
    })
  })

  describe('with any error', () => {
    it('returns error message', async () => {
      mockFetch
        .mockImplementationOnce(mockGetDataflowError)

      const toolResult = await handler({ dataflowId: 'gsheet_dataflow' })

      expect(toolResult).toEqual({
        isError: true,
        content: [{
          type: 'text',
          text: 'Failed to get data flow gsheet_dataflow. Response status: 500.',
        }]
      })
    })

    it('includes error details when present', async () => {
      mockFetch
        .mockImplementationOnce(mockGetDataflowErrorWithDetails)

      const toolResult = await handler({ dataflowId: 'gsheet_dataflow' })

      expect(toolResult).toEqual({
        isError: true,
        content: [{
          type: 'text',
          text: 'Failed to get data flow gsheet_dataflow. Response status: 500. Error details: Test error message',
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
        text: 'Invalid parameters for get-dataflow tool. Validation error: Required',
      }]
    })
  })

  it('returns error on missing dataflowId', async () => {
    const toolResult = await handler({})

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: 'Invalid parameters for get-dataflow tool. Validation error: Required at "dataflowId"',
      }]
    })
  })

  it('returns error on invalid dataflowId or extraneous parameters', async () => {
    const toolResult = await handler({ dataflowId: 123, executionId: true })

    expect(toolResult).toEqual({
      isError: true,
      content: [{
        type: 'text',
        text: "Invalid parameters for get-dataflow tool. Validation error: Expected string, received number at \"dataflowId\"; Unrecognized key(s) in object: 'executionId'"
      }]
    })
  })
})
