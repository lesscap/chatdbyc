import axios from 'axios'
import type { WebApplication as Application } from '../types'
import { config } from '../config/app'

const host = 'https://api.openai.com/v1'

type GetChatCompletionsParams = {
  Body: {
    model: string
    messages: CompletionsMessage[]
    temperature: number
  }
}

type CompletionsMessage = {
  rule: string
  content: string
}

export const ChatController = (app: Application) => {
  app.post<GetChatCompletionsParams>('/completions', async request => {
    const { body } = request
    const api = `${host}/chat/completions`
    const payload = {
      model: body.model ?? 'gpt-3.5-turbo',
      messages: body.messages ?? [],
      temperature: body.temperature ?? 0.7
    }
    const { data } = await axios.post(api, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openaiApiKey}`,
      }
    })
    return { success: true, data }
  })
}
