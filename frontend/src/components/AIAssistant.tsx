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
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [error, setError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleAgentMode = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    const userPrompt = prompt
    setPrompt('')
    
    try {
      const response = await fetch('https://geocities-reborn-production.up.railway.app/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          codeContext: currentCode,
          language: currentLanguage,
          theme: selectedTheme
        })
      })

      const data = await response.json()
      if (data.code) {
        onCodeUpdate(data.code)
      } else if (data.error) {
        setError(`AI Error: ${data.error}`)
        setPrompt(userPrompt)
      }
    } catch (error) {
      console.error('AI generation error:', error)
      setError('Failed to generate code. Make sure backend is running.')
      setPrompt(userPrompt)
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
    setError(null)

    try {
      // Build conversation history for better context
      const conversationHistory = messages.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n\n')

      const contextPrompt = conversationHistory 
        ? `Previous conversation:\n${conversationHistory}\n\nCurrent code:\n${currentCode}\n\nUser question: ${userMessage.content}`
        : `Current code:\n${currentCode}\n\nUser question: ${userMessage.content}`

      const response = await fetch('https://geocities-reborn-production.up.railway.app/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: contextPrompt,
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
                <div className="ai-time-notice">
                  ⏱️ Takes 20-80s • Gemini 2.0 Flash
                </div>

                {error && (
                  <div className="ai-error-message">
                    ⚠️ {error}
                  </div>
                )}
                
                <div className="theme-selector">
                  <label className="theme-label">🎨 Theme:</label>
                  <select 
                    className="theme-select"
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    disabled={loading}
                  >
                    <option value="default">🌈 Classic 90s</option>
                    <option value="cyber">🤖 Cyber</option>
                    <option value="gamer">🎮 Gamer</option>
                    <option value="glitter">✨ Glitter</option>
                    <option value="space">🚀 Space</option>
                  </select>
                </div>

                <textarea
                  className="ai-input"
                  placeholder="E.g., Add a rainbow gradient background with stars..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={3}
                  disabled={loading}
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
                <div className="chat-header-actions">
                  <span className="chat-status">💬 Conversational AI</span>
                  {messages.length > 0 && (
                    <button 
                      className="clear-chat-btn"
                      onClick={() => setMessages([])}
                      title="Clear conversation"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="empty-chat">
                      <p>💬 Start a conversation!</p>
                      <p className="hint">I remember our chat history for better context</p>
                      <div className="chat-suggestions">
                        <button onClick={() => setPrompt("Explain what this code does")}>Explain this code</button>
                        <button onClick={() => setPrompt("How can I improve this?")}>Suggest improvements</button>
                        <button onClick={() => setPrompt("Find any bugs or issues")}>Find bugs</button>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className={`message ${msg.role}`}>
                        <div className="message-icon">
                          {msg.role === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className="message-content">
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="message assistant">
                      <div className="message-icon">🤖</div>
                      <div className="message-content typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
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
