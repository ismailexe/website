import express from 'express'
import Groq from 'groq-sdk'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is missing! Create a .env file with your key.')
  process.exit(1)
}

const app = express()
const port = process.env.PORT || 3001

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json())

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are Osimhen, a helpful AI assistant. Be concise and friendly.' },
        ...messages,
      ],
      stream: true,
      max_tokens: 1024,
    })

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || ''
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('Chat error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    } else {
      res.write('data: [ERROR]\n\n')
      res.end()
    }
  }
})

app.listen(port, () => {
  console.log(`Osimhen server running on http://localhost:${port}`)
})
