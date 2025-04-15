
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { server } from '@/server/index.js'

const main = () => {
  const transport = new StdioServerTransport()
  server.connect(transport).catch((e) => {
    console.error('Fatal error: ', e)
    process.exit(1)
  })
}

main()
