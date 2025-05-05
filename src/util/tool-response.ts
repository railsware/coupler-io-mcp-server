export const textResponse = ({ text, isError = false }: { text: string, isError?: boolean }) => ({
  isError,
  content: [
    {
      type: 'text' as const,
      text,
    }
  ]
})
