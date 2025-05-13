import { parseTemplate } from 'url-template'
import type { Template } from 'url-template'
import { omit } from 'lodash'

import { COUPLER_API_HOST, APP_VERSION } from '@/env'
import { logger } from '@/logger'

type OptionsType = {
  request: RequestInit,
  expand?: Parameters<Template['expand']>[0],
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Coupler-Client': `CouplerMCP/${APP_VERSION}`,
}

export class CouplerioClient {
  auth: string
  baseUrl: string
  version: string

  constructor({ auth, baseUrl, version = 'v1' }: { auth: string, baseUrl?: string, version?: string }) {
    this.auth = auth
    if (!auth || !auth.length) {
      throw new Error('No auth provided')
    }

    this.baseUrl = `${(COUPLER_API_HOST || baseUrl)}/${version}`
    this.version = version
  }

  async request(pathTemplateString: string, options: OptionsType): Promise<Response> {
    const template = parseTemplate(pathTemplateString)
    const expand = options.expand || {}
    const optionalHeaders = options.request?.headers || {}
    const requestOptions = omit(options.request, 'headers')

    const path = template.expand(expand)
    const url = `${this.baseUrl}${path}`

    const request = new Request(url, {
      headers: {
        ...optionalHeaders,
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${this.auth}`,
      },
      ...requestOptions,
    })

    logger.debug(`Request URL: ${url}`)

    return await fetch(request)
  }
}
