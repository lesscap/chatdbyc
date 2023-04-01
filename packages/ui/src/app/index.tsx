import cx from 'classnames'
import { useState } from 'react'
import axios from 'axios'
import 'bulma/css/bulma.css'
import style from './style.module.scss'

const models = [
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
]

type Message = {
  type: 'request' | 'response'
  role?: string
  content: string
}

type Dict = Record<string, unknown>

type ChangeEvent = {
  target?: {
    value: unknown
  }
}

export const App = () => {
  const defaultData = {
    model: models[4],
    message: '向我打个招呼呗',
    temperature: 0.7,
  }
  const [form, setForm] = useState<Dict>(defaultData)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const field = <T = string,>(name: string) => {
    const onChange = (e: unknown) => {
      const maybe = e as ChangeEvent
      const next = maybe.target ? maybe.target.value : e
      setForm(prev => ({ ...prev, [name]: next }))
    }
    const value = form[name] as T
    return { value, onChange }
  }

  const handleClick = async () => {
    setLoading(true)
    setForm(prev => ({ ...prev, message: '' }))

    setMessages(prev => {
      const request: Message = { type: 'request', content: form.message as string }
      return [...prev, request]
    })

    const { data: res } = await axios
      .post('/api/chat/completions', {
        ...form,
      })
      .finally(() => {
        setLoading(false)
      })

    const data = res?.data
    const message = data?.choices?.[0]?.message
    setMessages(prev => {
      const response: Message = { type: 'response', content: message.content as string }
      return [...prev, response]
    })
  }

  return (
    <div className={style.app}>
      <div className="container is-fluid">
        <h2 className="title">Chat completions</h2>
        <div className={cx(style.messages, 'block')}>
          <Messages dataSource={messages} />
          {loading && <button className="button is-loading">loading...</button>}
        </div>
        <div className="block">
          <Field label="model">
            <div className="select">
              <select {...field('model')}>
                {models.map(model => (
                  <option key={model}>{model}</option>
                ))}
              </select>
            </div>
          </Field>
          <Field label="message">
            <textarea className="textarea" placeholder="message" {...field('message')} />
          </Field>
          <Field label="temperature">
            <input
              className="input"
              type="number"
              placeholder="temperature"
              {...field('temperature')}
            />
          </Field>
          <Field>
            <button
              className={cx('button is-primary', { 'is-loading': loading })}
              onClick={handleClick}
            >
              Send
            </button>
          </Field>
        </div>
      </div>
    </div>
  )
}

type MessagesProps = {
  dataSource: Message[]
}

const Messages = ({ dataSource }: MessagesProps) => {
  return (
    <div className={style.messages}>
      {dataSource.map(message => (
        <div
          className={cx(style.message, 'notification is-light', {
            'is-info': message.type === 'request',
          })}
        >
          {message.content}
        </div>
      ))}
    </div>
  )
}

type FieldProps = {
  label?: string
  children: React.ReactNode
}

const Field = ({ label, children }: FieldProps) => {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <div className="control">{children}</div>
    </div>
  )
}
