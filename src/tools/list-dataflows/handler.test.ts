import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { handler } from './handler'

const createMockResponse = (responseFn: () => Promise<Response>): typeof fetch => {
  return responseFn
}

const mockResponse = [
  { name: 'GSheet data flow', id: 'gsheet_dataflow', last_successful_execution_id: '11' },
  { name: 'JSON data flow', id: 'json_dataflow', last_successful_execution_id: '22' }
]


// Response mocks
const mockListDataflows = createMockResponse(
  async () => new Response(
    JSON.stringify(mockResponse)
  )
)

const mockListDataflowsError = createMockResponse(
  async () => new Response('Error listing dataflows', { status: 500 })
)

const mockFetch = vi.spyOn(globalThis, 'fetch')

describe('listDataflows', () => {
  beforeEach(async () => {
    mockFetch.mockReset()
  })

  afterAll(async () => {
    mockFetch.mockRestore()
  })

  it('returns a list of data flows', async () => {
    mockFetch
      .mockImplementationOnce(mockListDataflows)

    const toolResult = await handler()

    expect(toolResult).toEqual({
      isError: false,
      content: [{
        type: 'text',
        text: JSON.stringify(mockResponse),
      }]
    })
  })

  describe('with any error', () => {
    it('returns error message', async () => {
      mockFetch
        .mockImplementationOnce(mockListDataflowsError)

      const toolResult = await handler()

      expect(toolResult).toEqual({
        isError: true,
        content: [{
          type: 'text',
          text: 'Failed to list data flows. Response status: 500',
        }]
      })
    })
  })
})
