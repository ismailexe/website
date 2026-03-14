import { useState, useRef, useEffect } from 'react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [input])

  async function sendMessage() {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    // Add empty assistant message as typing indicator
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!response.ok) throw new Error('Request failed')

      const data = await response.json()

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: data.text }
        return updated
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          isError: true,
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const lastIsEmpty = messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    messages[messages.length - 1].content === '' &&
    isLoading

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <span className={`chat-status-dot${isLoading ? ' streaming' : ''}`} />
              <span className="chat-agent-name">osimhen</span>
            </div>
            <button className="chat-header-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <p>Hey! I'm <span>osimhen</span>.</p>
                <p>How can I help you?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
                <div className={`chat-bubble${msg.isError ? ' chat-bubble-error' : ''}`}>
                  {i === messages.length - 1 && lastIsEmpty
                    ? <span className="chat-typing"><span /><span /><span /></span>
                    : msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <textarea
              ref={el => { inputRef.current = el; textareaRef.current = el }}
              className="chat-input"
              placeholder="Message osimhen..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button
              className="chat-send"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              aria-label="Send"
            >
              ↑
            </button>
          </div>
        </div>
      )}

      <div className="chat-toggle-wrapper">
        {!isOpen && (
          <div className="osimhen-figure" aria-hidden="true">
            <svg viewBox="0 0 32 52" width="28" height="44" fill="none">
              {/* Head */}
              <circle cx="16" cy="5" r="4.5" fill="#f5c518"/>
              {/* Left arm raised */}
              <line x1="11" y1="14" x2="3" y2="6" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
              {/* Right arm raised */}
              <line x1="21" y1="14" x2="29" y2="6" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
              {/* Jersey */}
              <rect x="10" y="11" width="12" height="13" rx="2" fill="#FFD700"/>
              {/* Shorts */}
              <rect x="10" y="24" width="12" height="8" rx="1" fill="#CC0000"/>
              {/* Left leg */}
              <line x1="13" y1="32" x2="10" y2="44" stroke="#d4a96a" strokeWidth="3" strokeLinecap="round"/>
              {/* Right leg */}
              <line x1="19" y1="32" x2="22" y2="44" stroke="#d4a96a" strokeWidth="3" strokeLinecap="round"/>
              {/* Left foot */}
              <line x1="10" y1="44" x2="6" y2="46" stroke="#d4a96a" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Right foot */}
              <line x1="22" y1="44" x2="26" y2="46" stroke="#d4a96a" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        <button
          className={`chat-toggle${isOpen ? ' active' : ''}`}
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Toggle chat"
        >
          <span className="chat-toggle-dot" />
          osimhen
        </button>
      </div>
    </div>
  )
}
