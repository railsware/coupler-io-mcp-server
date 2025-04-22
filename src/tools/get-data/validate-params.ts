/**
 *
 * @throws {Error} If the params are invalid
 */
export const validateParams = (params: Record<string, unknown> | undefined): void => {
  if (!params) {
    throw new Error('This tool requires parameters')
  }

  if (!params.dataflowId || typeof params.dataflowId !== 'string' || params.dataflowId.trim() === '') {
    throw new Error('Missing or invalid required parameter: dataflowId must be a non-empty string')
  }

  if (!params.query || typeof params.query !== 'string' || !params.query.startsWith('SELECT')) {
    throw new Error('Missing or invalid required parameter: query must be a SELECT statement')
  }
}
