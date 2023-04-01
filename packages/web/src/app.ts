import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import fastifyStatic from '@fastify/static'
import fastifyQs from 'fastify-qs'
import fileUpload from 'fastify-file-upload'
import { config } from './config/app'
import { Router } from './router'

const app = fastify({
  logger: {
    level: 'info'
  }
})

app.register(fastifyStatic, {
  root: config.staticRoot,
})

app.register(fileUpload, {
  limits: { fileSize: 10 * 1024 * 1024 }
})

app.register(fastifyCookie)
app.register(fastifySession, {
  secret: config.session.secret,
  cookie: {
    secure: false
  }
})

app.register(fastifyQs, {})

app.get('/', (_req: unknown, replay: any) => {
  replay.sendFile('index.html')
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
  global.console.debug('config:\n', config)
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
