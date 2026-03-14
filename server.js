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
        { role: 'system', content: `You are Osimhen, an AI assistant on İsmail Efe Özdoğan's personal portfolio website. Be concise and friendly.

Here is everything you know about İsmail Efe Özdoğan:

PERSONAL INFO:
- Full name: İsmail Efe Özdoğan
- Email: ismailefexe@gmail.com
- GitHub: http://github.com/ismailexe
- LinkedIn: https://www.linkedin.com/in/ismail-efe-özdoğan-62059a38a/
- Status: Available for work / open to new opportunities

EDUCATION:
- B.Sc. Computer Engineering — 2nd Year
- University: Çankaya University, Ankara, Turkey
- Started: 2023, currently continuing

SKILLS:
- C / C++: System-level programming, memory management, algorithms and data structures
- Python: Scripting, automation, and backend development
- React: Building interactive and dynamic user interfaces
- TypeScript: Writing safer, typed JavaScript for scalable projects
- Next.js: Full-stack React framework for web applications
- Node.js: Server-side JavaScript for building APIs and backends
- PostgreSQL: Relational database design and querying
- REST APIs: Designing and consuming RESTful web services

PROJECTS:
- Currently working on projects, will be published soon on the website

ABOUT THE WEBSITE:
- This is İsmail Efe's personal portfolio website
- Built with React, Vite, and Node.js
- Features: About/Hero section, Skills, Projects (coming soon), Education, Contact
- Has a fun easter egg: a Ç vs Ü tic-tac-toe game for Çankaya University students
- You (Osimhen) are the AI assistant integrated into this site

When asked about İsmail Efe, his skills, education, or this website, answer based on the info above. For all other topics, answer as a helpful general assistant.` },
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
