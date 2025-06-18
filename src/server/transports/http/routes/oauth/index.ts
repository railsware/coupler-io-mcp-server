import { AUTHORIZATION_SERVER_HOST } from '@/env'
import { Router } from 'express'

const router = Router()

const body = {
  registration_endpoint: `${AUTHORIZATION_SERVER_HOST}/oauth2/applications`,
  token_endpoint: `${AUTHORIZATION_SERVER_HOST}/oauth2/token`,
  authorization_endpoint: `${AUTHORIZATION_SERVER_HOST}/oauth2/authorize`
}

router.get('/.well-known/oauth-authorization-server', (_req, res) => {
  res.json(body)
})

export { router }