import { mkdir } from 'node:fs/promises'
import { request } from '@/lib/couplerio-sdk/request'
import { STORAGE_HOST } from '@/env'

export const DOWNLOAD_DIR = '/tmp/dataflows'
const STORAGE_URL = new URL(STORAGE_HOST)

const parseUrl = (url: string): URL => {
  const parsedUrl = new URL(url)

  parsedUrl.host = STORAGE_URL.host
  parsedUrl.protocol = STORAGE_URL.protocol
  parsedUrl.port = STORAGE_URL.port

  return parsedUrl
}

const downloadToFile = async (url: URL, filePath: string) => {
  const fileResponse = await fetch(url.toString())
  if (!fileResponse.ok) {
    throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`)
  }
  await Bun.write(filePath, fileResponse)
}

type GetDataArgs = { dataflowId: string }

export const getData = async ({ dataflowId }: GetDataArgs): Promise<string> => {
  const path = `/v1/dataflows/${dataflowId}/signed_urls`
  const signedUrlsRequest = request(path, { method: 'POST' })

  const signedUrlsResponse = await fetch(signedUrlsRequest)
  if (!signedUrlsResponse.ok) {
    throw new Error(`Failed to get signed URLs for dataflow ${dataflowId}: ${signedUrlsResponse.status} ${signedUrlsResponse.statusText}`)
  }

  const payload = await signedUrlsResponse.json() as { sqlite_file: string, schema_file: string }
  if (!payload || !payload.sqlite_file || !payload.schema_file) {
    throw new Error(`Unexpected response from signed URLs request: ${JSON.stringify(payload)}`)
  }

  console.error(`
    Sqlite Signed URL: ${payload.sqlite_file}
    -----------------------------
    Schema Signed URL: ${payload.schema_file}
  `)

  const parsedSqliteUrl = parseUrl(payload.sqlite_file)
  const parsedSchemaUrl = parseUrl(payload.schema_file)

  console.error(`
    Sqlite Parsed URL: ${parsedSqliteUrl}
    -----------------------------
    Schema Parsed URL: ${parsedSchemaUrl}
  `)

  const sqliteFilePath = `${DOWNLOAD_DIR}/${dataflowId}/rows.sqlite`
  const schemaFilePath = `${DOWNLOAD_DIR}/${dataflowId}/schema.json`

  await mkdir(DOWNLOAD_DIR, { recursive: true })

  await Promise.all([
    downloadToFile(parsedSqliteUrl, sqliteFilePath),
    downloadToFile(parsedSchemaUrl, schemaFilePath)
  ])

  return sqliteFilePath
}
