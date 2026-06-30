/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Bot, Send, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { askTradingAssistant } from '../services/aiService.js'

export function ChatBotPanel({ analysis, market, timeframe }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Ask me about the current signal, risk, entry levels, or market context.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const context = useMemo(
    () => ({
      market,
      timeframe,
      signal: analysis?.signal,
      trend: analysis?.trend,
      confidenceScore: analysis?.confidenceScore,
      riskScore: analysis?.riskScore,
      currentPrice: analysis?.currentPrice,
      support: analysis?.support,
      resistance: analysis?.resistance,
      recommendation: analysis?.recommendation,
    }),
    [analysis, market, timeframe],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const message = input.trim()
    if (!message || loading) return

    setInput('')
    setLoading(true)
    setMessages((current) => [...current, { role: 'user', text: message }])

    try {
      const response = await askTradingAssistant({ message, context })
      setMessages((current) => [...current, { role: 'assistant', text: response.answer }])
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', text: error.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="chat-panel">
      <div className="panel-head">
        <h2>ChatGPT Market Bot</h2>
        <span>{loading ? 'Thinking' : 'Live API ready'}</span>
      </div>
      <div className="chat-thread" aria-live="polite">
        {messages.map((message, index) => {
          const Icon = message.role === 'assistant' ? Bot : UserRound
          return (
            <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
              <Icon size={16} aria-hidden="true" />
              <p>{message.text}</p>
            </div>
          )
        })}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          aria-label="Ask market bot"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about this setup"
        />
        <button className="icon-btn" type="submit" disabled={loading || !input.trim()} aria-label="Send message">
          <Send size={16} aria-hidden="true" />
        </button>
      </form>
    </section>
  )
}
