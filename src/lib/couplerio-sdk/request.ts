import { COUPLER_API_HOST } from '@/env'

type RequestOptions = {
  method: string
  body?: string
}

export const request = (path: string, options: RequestOptions = { method: 'GET' }) => {
  const url = COUPLER_API_HOST + path

  return new Request(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${COUPLER_ACCESS_TOKEN}`,
    },
  })
}
