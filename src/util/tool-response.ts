import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { logger } from '../logger/index.js'

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

export const buildErrorMessage = async ({
  response,
  customText = 'An unexpected error occurred.',
}: {
  response: Response,
  customText: string,
}): Promise<string> => {
  let errorDetails = ''

  try {
    const { error } = await response.json() as { error?: { message?: string } }
    errorDetails = error?.message ?? ''
  } catch (err: unknown) {
    logger.error({ err }, 'Failed to parse JSON response.')
  }

  return `${customText} Response status: ${response.status}.` +
         (errorDetails ? ` Error details: ${errorDetails}` : '')
}
