/**
 *
 * @throws {Error} If the params are invalid
 */
export const validateParams = (params?: Record<string, unknown>): void => {
  if (!params) {
    throw new Error('This tool requires parameters')
  }

  const { dataflowId, query } = params

  if (typeof dataflowId !== 'string' || !dataflowId) {
    throw new Error('Missing or invalid required parameter: dataflowId must be a non-empty string')
  }

  if (typeof query !== 'string' || !query) {
    throw new Error('Missing or invalid required parameter: query must be a non-empty string')
  }

  if (!(/^select\b/i.test(query))) {
    throw new Error('Missing or invalid required parameter: query must start with SELECT')
  }
}
