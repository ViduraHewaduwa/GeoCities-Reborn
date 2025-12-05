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
  const [success, setSuccess] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleAgentMode = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(null)
    const userPrompt = prompt
    setPrompt('')
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 90000) // 90s timeout

      const response = await fetch('https://geocities-reborn-production.up.railway.app/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          codeContext: currentCode,
          language: currentLanguage,
          theme: selectedTheme
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.code) {
        onCodeUpdate(data.code)
        setError(null)
        setSuccess('✅ Code generated successfully!')
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        throw new Error('No code returned from AI')
      }
    } catch (error: any) {
      console.error('AI generation error:', error)
      
      // Restore prompt so user can retry
      setPrompt(userPrompt)
      
      // User-friendly error messages
      if (error.name === 'AbortError') {
        setError('⏱️ Request timed out (90s). The AI took too long. Try a simpler request.')
      } else if (error.message?.includes('API_KEY_MISSING')) {
        setError('🔑 API key not configured. Contact administrator.')
      } else if (error.message?.includes('RATE_LIMIT')) {
        setError('⏳ Too many requests. Please wait 30 seconds and try again.')
      } else if (error.message?.includes('SERVICE_UNAVAILABLE')) {
        setError('🔧 AI service temporarily down. Try again in a few seconds.')
      } else if (error.message?.includes('EMPTY_RESPONSE')) {
        setError('📝 AI returned empty response. Try rephrasing your request.')
      } else if (error.message?.includes('NETWORK_ERROR') || error.message?.includes('fetch')) {
        setError('🌐 Network error. Check your internet connection.')
      } else if (error.message?.includes('Failed to fetch')) {
        setError('🔌 Cannot connect to server. Backend may be down.')
      } else {
        setError(`❌ ${error.message || 'Failed to generate code. Please try again.'}`)
      }
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
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout for chat

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
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.explanation) {
        const assistantMessage: Message = { role: 'assistant', content: data.explanation }
        setMessages(prev => [...prev, assistantMessage])
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        throw new Error('No response from AI')
      }
    } catch (error: any) {
      console.error('AI chat error:', error)
      
      let errorMsg = '❌ Failed to get response. '
      
      if (error.name === 'AbortError') {
        errorMsg = '⏱️ Request timed out. The AI took too long to respond.'
      } else if (error.message?.includes('API_KEY_MISSING')) {
        errorMsg = '🔑 API key not configured. Contact administrator.'
      } else if (error.message?.includes('RATE_LIMIT')) {
        errorMsg = '⏳ Too many requests. Please wait 30 seconds.'
      } else if (error.message?.includes('SERVICE_UNAVAILABLE')) {
        errorMsg = '🔧 AI service temporarily unavailable. Try again shortly.'
      } else if (error.message?.includes('EMPTY_RESPONSE')) {
        errorMsg = '📝 AI returned empty response. Try rephrasing your question.'
      } else if (error.message?.includes('Failed to fetch')) {
        errorMsg = '🔌 Cannot connect to server. Backend may be down.'
      } else if (error.message) {
        errorMsg = `❌ ${error.message}`
      }
      
      const errorMessage: Message = { role: 'assistant', content: errorMsg }
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
                {loading ? (
                  <div className="ai-progress-notice">
                    <div className="progress-spinner">⏳</div>
                    <div className="progress-text">
                      <strong>Generating code...</strong>
                      <small>This usually takes 20-80 seconds</small>
                    </div>
                  </div>
                ) : (
                  <div className="ai-time-notice">
                    ⏱️ Takes 20-80s • Gemini 2.0 Flash
                  </div>
                )}

                {success && (
                  <div className="ai-success-message">
                    {success}
                    <button 
                      className="success-dismiss"
                      onClick={() => setSuccess(null)}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {error && (
                  <div className="ai-error-message">
                    {error}
                    <button 
                      className="error-dismiss"
                      onClick={() => setError(null)}
                      title="Dismiss error"
                    >
                      ✕
                    </button>
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
                  onKeyDown={handleKeyDown}
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
                    onKeyDown={handleKeyDown}
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
