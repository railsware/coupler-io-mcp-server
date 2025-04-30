export const errorResponse = (text: string) => ({
  isError: true,
  content: [
    {
      type: 'text' as const,
      text,
    }
  ]
})

export const textResponse = (text: string) => ({
  isError: false,
  content: [
    {
      type: 'text' as const,
      text,
    }
  ]
})
