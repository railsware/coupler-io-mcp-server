import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export const textResponse = ({ text, isError = false, structuredContent }: { text: string, isError?: boolean, structuredContent?: Record<string, unknown> }) => {
  const callToolResult: CallToolResult = {
  isError,
  content: [
    {
      type: 'text' as const,
      text,
    }
  ]
  }

  if (structuredContent) {
    callToolResult.structuredContent = structuredContent
  }

  return callToolResult
}
