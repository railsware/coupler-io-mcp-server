import { TRANSPORT } from '@/env'
import { stdioServer } from '@/server/transports/stdio'
import { httpServer } from '@/server/transports/http'

const main = () => {
  const server = TRANSPORT === 'stdio' ? stdioServer : httpServer

  server.start()
}

main()
