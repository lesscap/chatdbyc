import type { WebApplication as Application } from '../types'

export const PageController = (app: Application) => {
  app.get('/welcome', async () => {
    return { success: true, data: 'chatdybc!' }
  })
}
