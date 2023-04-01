import type { FastifyPluginCallback } from 'fastify'
import { PageController } from './controllers/page'

const controllers = {
  '/api/page': PageController,
}

export const Router: FastifyPluginCallback = (app, _options, done) => {
  const names = Object.keys(controllers)
  names.forEach(prefix => {
    const list = ensureArray(controllers[prefix])
    list.forEach(controller => {
      app.register(wrap(controller), { prefix })
    })
  })
  done()
}

function wrap(plugin) {
  return (app, options, done) => {
    const init = async () => {
      await plugin(app, options)
      done(null)
    }
    init().catch(done)
  }
}

function ensureArray(value: unknown) {
  return Array.isArray(value) ? value : [value]
}
