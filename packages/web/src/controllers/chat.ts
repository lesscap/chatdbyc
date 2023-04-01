import axios from 'axios'
import type { WebApplication as Application } from '../types'
import { config } from '../config/app'

const host = 'https://api.openai.com/v1'

type GetChatCompletionsParams = {
  Body: {
    model: string
    message: string
    temperature: number
  }
}

export const ChatController = (app: Application) => {
  app.post<GetChatCompletionsParams>('/completions', async request => {
    const { body } = request
    global.console.debug(body)
    const api = `${host}/chat/completions`
    const messages = [
      { role: 'user', content: body.message }
    ]
    const payload = {
      model: body.model ?? 'gpt-3.5-turbo',
      messages,
      temperature: body.temperature ?? 0.7,
    }
    const { data } = await axios.post(api, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openaiApiKey}`,
      },
    })
    return { success: true, data }
  })
}
