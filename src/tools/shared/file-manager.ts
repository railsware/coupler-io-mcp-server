import { mkdir } from 'node:fs/promises'

import { COUPLER_ACCESS_TOKEN, NODE_ENV } from '@/env'
import { CouplerioClient } from '@/lib/couplerio-client'

export const DOWNLOAD_DIR = `/tmp/coupler_mcp/${NODE_ENV}/dataflows`

type FileType = 'sqlite' | 'schema'

export class FileManager {
  readonly dataflowId: string
  readonly coupler: CouplerioClient

  constructor({ dataflowId, Client = CouplerioClient }: { dataflowId: string, Client?: typeof CouplerioClient }) {
    this.dataflowId = dataflowId
    this.coupler = new Client({ auth: COUPLER_ACCESS_TOKEN })
  }

  async initStorage() {
    await mkdir(DOWNLOAD_DIR, { recursive: true })
  }

  /**
   *
   * @throws {Error} If the file does not exist yet and can't be downloaded
   */
  async getFile(fileType: FileType): Promise<string> {
    const filePath = this.buildFilePath(fileType)
    const fileExists = await Bun.file(filePath).exists()

    if (fileExists) {
      return filePath
    }

    const fileUrl = await this.getFileUrl(fileType)

    return await this.downloadFile(fileUrl, fileType)
  }

  /**
   *
   * @throws {Error} If the file can't be downloaded or written
   */
  async downloadFile(url: string, fileType: FileType): Promise<string> {
    await this.initStorage()
    const fileResponse = await fetch(url)
    const filePath = this.buildFilePath(fileType)

    if (!fileResponse.ok) {
      throw new Error(`Failed to download file. Response status: ${fileResponse.status}`)
    }

    await Bun.write(filePath, fileResponse)

    return filePath
  }

  buildFilePath(fileType: FileType): string {
    const fileName = fileType === 'sqlite' ? 'rows.sqlite' : 'schema.json'

    return `${DOWNLOAD_DIR}/${this.dataflowId}/${fileName}`
  }

  /**
   *
   * @throws {Error} If the request fails
   */
  async getFileUrl(fileType: FileType): Promise<string> {
    const response = await this.coupler.request(
      '/dataflows/{dataflowId}/signed_url',
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

    const { signed_url: signedUrl } = await response.json() as { signed_url: string }

    return signedUrl
  }


}
