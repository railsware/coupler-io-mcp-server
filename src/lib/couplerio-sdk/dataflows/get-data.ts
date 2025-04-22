import { mkdir } from 'node:fs/promises'
import { request } from '@/lib/couplerio-sdk/request'
import { COUPLER_API_HOST, STORAGE_HOST } from '@/env'

export const DOWNLOAD_DIR = '/tmp/dataflows'
const STORAGE_URL = new URL(STORAGE_HOST)
const COUPLER_API_URL = new URL(COUPLER_API_HOST)

type GetDataArgs = { dataflowId: string }

export const getData = async ({ dataflowId }: GetDataArgs): Promise<string> => {
  const filePath = `${DOWNLOAD_DIR}/${dataflowId}.sqlite`
  // if (await Bun.file(filePath).exists()) {
  //   return filePath
  // }

  const path = `/api/workflows/${dataflowId}/export_url`
  const exportUrlRequest = request(path, { method: 'POST' })

  const exportUrlResponse = await fetch(exportUrlRequest)
  if (!exportUrlResponse.ok) {
    throw new Error(`Failed to get export URL for dataflow ${dataflowId}: ${exportUrlResponse.status} ${exportUrlResponse.statusText}`)
  }

  const payload = await exportUrlResponse.json() as { export_url: string }
  if (!payload || !payload.export_url) {
    throw new Error(`Unexpected response from export URL request: ${JSON.stringify(payload)}`)
  }

  console.error(`Export URL: ${payload.export_url}`)

  const parsedExportUrl = new URL(payload.export_url)
  parsedExportUrl.host = COUPLER_API_URL.host
  parsedExportUrl.protocol = COUPLER_API_URL.protocol
  parsedExportUrl.port = COUPLER_API_URL.port

  const downloadResponse = await fetch(parsedExportUrl.toString(), { redirect: 'manual' })
  const fileUrl = downloadResponse.headers.get('Location')

  console.error(`File URL: ${fileUrl}`)
  const parsedFileUrl = new URL(fileUrl!)

  parsedFileUrl.host = STORAGE_URL.host
  parsedFileUrl.protocol = STORAGE_URL.protocol
  parsedFileUrl.port = STORAGE_URL.port

  console.error(`Parsed file URL: ${parsedFileUrl}`)

  const fileResponse = await fetch(parsedFileUrl.toString())

  await mkdir(DOWNLOAD_DIR, { recursive: true })

  if (!fileResponse.ok) {
    throw new Error(`Failed to download data file for dataflow ${dataflowId}: ${fileResponse.status} ${fileResponse.statusText}`)
  }

  await Bun.write(filePath, fileResponse)

  return filePath
}
