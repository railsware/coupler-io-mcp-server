import { existsSync, writeFileSync, mkdirSync } from 'node:fs'

import { COUPLER_ACCESS_TOKEN, NODE_ENV } from '#env.js'
import { CouplerioClient } from '#lib/couplerio-client/index.js'
import type { SignedUrlDto } from '#lib/couplerio-client/dataflows/signed_url.js'

export const DOWNLOAD_DIR = `/tmp/coupler_mcp/${NODE_ENV}/dataflows`

const DataflowFile = {
  sqlite: {
    name: 'rows.sqlite'
  },
  schema: {
    name: 'schema.json'
  }
}

export class FileManager {
  readonly dataflowId: string
  readonly executionId: string
  readonly coupler: CouplerioClient

  constructor({
    dataflowId,
    executionId,
    Client = CouplerioClient
  }: {
    dataflowId: string,
    executionId: string,
    Client?: typeof CouplerioClient
  }) {
    this.dataflowId = dataflowId
    this.executionId = executionId
    this.coupler = new Client({ auth: COUPLER_ACCESS_TOKEN })
  }

  initStorage() {
    mkdirSync(`${DOWNLOAD_DIR}/${this.dataflowId}/${this.executionId}`, { recursive: true })
  }

  /**
   *
   * @throws {Error} If the file does not exist yet and can't be downloaded
   */
  async getFile(fileType: keyof typeof DataflowFile): Promise<string> {
    const filePath = this.buildFilePath(fileType)

    if (existsSync(filePath)) {
      return filePath
    }

    const fileUrl = await this.getFileUrl(fileType)

    return await this.downloadFile(fileUrl, fileType)
  }

  /**
   *
   * @throws {Error} If the file can't be downloaded or written
   */
  async downloadFile(url: string, fileType: keyof typeof DataflowFile): Promise<string> {
    await this.initStorage()
    const fileResponse = await fetch(url)
    const filePath = this.buildFilePath(fileType)

    if (!fileResponse.ok) {
      throw new Error(`Failed to download file. Response status: ${fileResponse.status}`)
    }

    const data = Buffer.from(await fileResponse.arrayBuffer())

    writeFileSync(filePath, data)

    return filePath
  }

  buildFilePath(fileType: keyof typeof DataflowFile): string {
    const fileName = fileType === 'sqlite' ? DataflowFile.sqlite.name : DataflowFile.schema.name

    return `${DOWNLOAD_DIR}/${this.dataflowId}/${this.executionId}/${fileName}`
  }

  /**
   *
   * @throws {Error} If the request fails
   */
  async getFileUrl(fileType: keyof typeof DataflowFile): Promise<string> {
    const query = new URLSearchParams({
      execution_id: this.executionId,
    })

    const response = await this.coupler.request(
      `/dataflows/{dataflowId}/signed_url?${query}`,
      {
        expand: { dataflowId: this.dataflowId },
        request: {
          method: 'POST',
          body: JSON.stringify({
            file: fileType
          })
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get ${fileType} file signed URL for dataflow ID ${this.dataflowId}. Response status: ${response.status}`)
    }

    const { signed_url: signedUrl } = await response.json() as SignedUrlDto

    return signedUrl
  }
}
