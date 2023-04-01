import 'dotenv/config'

import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import fastifyQs from 'fastify-qs'
import fileUpload from 'fastify-file-upload'
import { Router } from './router'

const app = fastify({
  logger: {
    level: 'info'
  }
})

app.register(fileUpload, {
  limits: { fileSize: 10 * 1024 * 1024 }
})

app.register(fastifyCookie)
app.register(fastifySession, {
  secret: 'YV-OwxHoE-A4IpZ-JvpziuXfQNk0tY02A1UlNm3OwMk9BICSPzmgODxa9nuUBeh8',
  cookie: {
    secure: false
  }
})

app.register(fastifyQs, {})

app.get('/', () => {
  return 'ok!'
})

app.register(Router)

process.on('SIGINT', () => {
  global.console.log('siginit')
  app.close(() => {
    global.console.log('closed')
    process.exit()
  })
})

const start = async () => {
  try {
    const port = +(process.env.PORT ?? '4000')
    await app.listen({ port, host: '0.0.0.0' })
    global.console.log(`server listening on ${port}`)
  } catch (e) {
    app.log.error(e)
    process.exit(1)
  }
}

start()
