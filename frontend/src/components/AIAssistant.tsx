import { useState, useRef, useEffect } from 'react'
import './AIAssistant.css'

interface AIAssistantProps {
  currentCode: string
  currentLanguage: string
  onCodeUpdate: (code: string) => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIAssistant({ currentCode, currentLanguage, onCodeUpdate }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'agent' | 'chat'>('agent')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleAgentMode = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          codeContext: currentCode,
          language: currentLanguage
        })
      })

      const data = await response.json()
      if (data.code) {
        onCodeUpdate(data.code)
        setPrompt('')
      } else if (data.error) {
        alert(`AI Error: ${data.error}`)
      }
    } catch (error) {
      console.error('AI generation error:', error)
      alert('Failed to generate code. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleChatMode = async () => {
    if (!prompt.trim()) return

    const userMessage: Message = { role: 'user', content: prompt }
    setMessages(prev => [...prev, userMessage])
    setPrompt('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: `${currentCode}\n\nUser question: ${userMessage.content}`,
          language: currentLanguage
        })
      })

      const data = await response.json()
      if (data.explanation) {
        const assistantMessage: Message = { role: 'assistant', content: data.explanation }
        setMessages(prev => [...prev, assistantMessage])
      } else if (data.error) {
        const errorMessage: Message = { role: 'assistant', content: `Error: ${data.error}` }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage: Message = { role: 'assistant', content: 'Failed to get response. Check backend.' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (mode === 'agent') {
      handleAgentMode()
    } else {
      handleChatMode()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={`ai-assistant ${isOpen ? 'open' : ''}`}>
      <button className="ai-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🤖'} AI
      </button>

      {isOpen && (
        <div className="ai-panel">
          <div className="ai-header">
            <h3>🤖 AI Assistant</h3>
            <button className="ai-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="ai-mode-switch">
            <button 
              className={`mode-btn ${mode === 'agent' ? 'active' : ''}`}
              onClick={() => setMode('agent')}
            >
              ⚡ Agent
            </button>
            <button 
              className={`mode-btn ${mode === 'chat' ? 'active' : ''}`}
              onClick={() => setMode('chat')}
            >
              💬 Chat
            </button>
          </div>

          <div className="ai-content">
            {mode === 'agent' ? (
              <div className="agent-mode">
                <p className="mode-description">
                  Agent mode will directly edit your code based on your instructions.
                </p>
                <textarea
                  className="ai-input"
                  placeholder="E.g., Add a rainbow gradient background with stars..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={4}
                />
                <button 
                  className="ai-action-btn"
                  onClick={handleSubmit}
                  disabled={loading || !prompt.trim()}
                >
                  {loading ? '⏳ Generating...' : '⚡ Generate & Apply'}
                </button>
              </div>
            ) : (
              <div className="chat-mode">
                <p className="mode-description">
                  Chat with AI about your code. Ask questions or get suggestions.
                </p>
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="empty-chat">
                      <p>💬 Start a conversation!</p>
                      <p className="hint">Ask about your code or request suggestions</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className={`message ${msg.role}`}>
                        <div className="message-icon">
                          {msg.role === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className="message-content">{msg.content}</div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input-container">
                  <textarea
                    className="chat-input"
                    placeholder="Ask me anything about your code..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={2}
                  />
                  <button 
                    className="chat-send-btn"
                    onClick={handleSubmit}
                    disabled={loading || !prompt.trim()}
                  >
                    {loading ? '⏳' : '➤'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="ai-footer">
            <small>💡 Press Enter to send, Shift+Enter for new line</small>
          </div>
        </div>
      )}
    </div>
  )
}
