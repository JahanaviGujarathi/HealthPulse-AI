'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles, X, Send, Bot, User, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { FormattedMarkdownText } from '@/components/ui/formatted-markdown'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  actions?: Array<{ label: string; onClick: () => void }>
}

export function AiChatAssistant() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const welcomeMessage: Message = {
    id: 'welcome',
    text: 'Hello! I am your AI Health Assistant. How can I help you today? You can ask about water safety, symptoms, or how the reporting system works.',
    isBot: true,
    timestamp: new Date(),
  }

  // Initialize messages on first open
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage])
    }
  }, [messages.length])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: textToSend,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: textToSend }),
      })

      const data = await res.json()
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        text: data.text || 'I am processing regional surveillance data. How else can I assist you?',
        isBot: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (e) {
      const fallbackResponse: Message = {
        id: `bot-${Date.now()}`,
        text: '🤖 Emergency Public Health Advisory:\n\nPlease boil drinking water if in flood zones or contact 108 for medical emergency assistance.',
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const generateAiResponse = (query: string): Message => {
    const q = query.toLowerCase()
    let text = ''
    let actions: Array<{ label: string; onClick: () => void }> = []

    if (q.includes('water') || q.includes('boil') || q.includes('well') || q.includes('dirty') || q.includes('contamination') || q.includes('turbidity')) {
      text = `🚨 **Water Quality Advisory**: Kamalabari, Majuli currently has a boil-water advisory active.\n\n` +
        `• **Monitored Source**: Kamalabari Community Well #3 is showing elevated turbidity (12.4 NTU) and low chlorine (0.1 mg/L).\n` +
        `• **Recommendation**: Please boil water for at least 1 minute before drinking or cooking. You can also request a clean water tanker.`
      actions = [
        {
          label: 'Go to Citizen Dashboard',
          onClick: () => router.push('/login?redirect=/dashboard/citizen?section=map'),
        },
      ]
    } else if (q.includes('symptom') || q.includes('diarrhea') || q.includes('fever') || q.includes('vomiting') || q.includes('sick') || q.includes('sickness') || q.includes('outbreak')) {
      text = `🤒 **Symptom Guidance & Reporting**:\n\n` +
        `If you or anyone in your household is experiencing symptoms (like fever, watery diarrhea, vomiting, or abdominal pain), please report it immediately to your local health worker.\n\n` +
        `• **Action**: Submit an Aadhaar-verified report. This instantly alerts ASHA Worker *Anjali Boro* to verify and deploy help.\n` +
        `• **Resource**: Start drinking ORS (Oral Rehydration Salts) and visit the nearest clinic.`
      actions = [
        {
          label: 'File a Health Report',
          onClick: () => router.push('/login?redirect=/dashboard/citizen?section=report'),
        },
      ]
    } else if (q.includes('clinic') || q.includes('hospital') || q.includes('doctor') || q.includes('nearest') || q.includes('phone') || q.includes('call') || q.includes('emergency')) {
      text = `🏥 **Local Healthcare Resources** (Majuli):\n\n` +
        `• **Kamalabari PHC** (Primary Health Centre): 1.2 km away. Open 24/7 for acute symptoms.\n` +
        `• **Majuli CHC** (Community Health Centre): 6 beds currently available.\n\n` +
        `📞 **Emergency Numbers**:\n` +
        `• **108** - Free Ambulance dispatcher\n` +
        `• **104** - State Health Advisory helpline`
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('hola')) {
      text = 'Hello! I am the HealthPulse AI assistant. How is the health and water quality in your village today?'
    } else {
      text = 'I can help you look up local water quality advisories, give emergency medical contacts, or guide you on how to file a health concern report. What would you like to do?'
      actions = [
        { label: 'Check Water Safety', onClick: () => handleSendMessage('Check Water Safety') },
        { label: 'Report Sickness', onClick: () => handleSendMessage('Report Sickness') },
        { label: 'Find Nearest Clinic', onClick: () => handleSendMessage('Find Nearest Clinic') },
      ]
    }

    return {
      id: `bot-${Date.now()}`,
      text,
      isBot: true,
      timestamp: new Date(),
      actions: actions.length > 0 ? actions : undefined,
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-350 hover:scale-110 flex items-center justify-center border cursor-pointer",
          isOpen 
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/95 border-destructive/20" 
            : "bg-gradient-to-tr from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground hover:shadow-primary/30 border-primary/10 shadow-lg shadow-primary/20"
        )}
        aria-label="Toggle assistant"
      >
        {isOpen ? (
          <X className="size-6" />
        ) : (
          <div className="relative">
            <Sparkles className="size-6 text-white" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </Button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="absolute bottom-18 right-0 w-[380px] sm:w-[420px] h-[550px] flex flex-col rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 glass-card">
          {/* Header */}
          <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 via-accent/10 to-emerald-400/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                  HealthPulse Assistant
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                    AI Active
                  </Badge>
                </h4>
                <p className="text-[10px] text-muted-foreground">Regional Outbreak & Water Safety Guide</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Quick Stats Banner inside Chat */}
          <div className="px-4 py-2 border-b border-border bg-amber-500/10 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Droplets className="size-3 text-amber-500 animate-bounce" />
              Boil water advisory: Kamalabari
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 font-bold uppercase">
              Alert
            </span>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2.5 max-w-[85%]",
                  msg.isBot ? "mr-auto" : "ml-auto flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm",
                    msg.isBot 
                      ? "bg-gradient-to-tr from-primary to-accent" 
                      : "bg-muted-foreground/30 text-foreground"
                  )}
                >
                  {msg.isBot ? <Bot className="size-4" /> : <User className="size-4 text-muted-foreground" />}
                </div>
                <div className="space-y-2">
                  <div
                    className={cn(
                      "rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs whitespace-pre-line border",
                      msg.isBot
                        ? "bg-card border-border/80 text-foreground"
                        : "bg-primary text-primary-foreground border-primary/20 shadow-lg shadow-primary/10"
                    )}
                  >
                    <FormattedMarkdownText content={msg.text} />
                  </div>
                  
                  {/* Actions/Suggestions */}
                  {msg.actions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={act.onClick}
                          className="text-[11px] font-bold text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary border border-primary/20 rounded-full px-3 py-1 transition-all cursor-pointer shadow-xs"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2.5 max-w-[80%]">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shrink-0">
                  <Bot className="size-4" />
                </div>
                <div className="bg-card border border-border/80 rounded-2xl p-3 shadow-xs">
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="size-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="size-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="size-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Footer */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2.5 bg-muted/20 border-t border-border flex flex-wrap gap-1.5 justify-center">
              <button
                onClick={() => handleSendMessage('Check Water Safety')}
                className="text-[10px] font-extrabold text-foreground bg-card hover:bg-muted border border-border rounded-full px-3 py-1 transition-all cursor-pointer shadow-xs"
              >
                💧 Check Water Safety
              </button>
              <button
                onClick={() => handleSendMessage('Report Sickness')}
                className="text-[10px] font-extrabold text-foreground bg-card hover:bg-muted border border-border rounded-full px-3 py-1 transition-all cursor-pointer shadow-xs"
              >
                🤒 Report Sickness
              </button>
              <button
                onClick={() => handleSendMessage('Find Nearest Clinic')}
                className="text-[10px] font-extrabold text-foreground bg-card hover:bg-muted border border-border rounded-full px-3 py-1 transition-all cursor-pointer shadow-xs"
              >
                🏥 Find Nearest Clinic
              </button>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(input)
            }}
            className="p-3 border-t border-border bg-card/90 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about water safety, symptoms, or clinics..."
              className="flex-1 text-xs h-10 border-border bg-muted/40 hover:bg-muted/65 focus:bg-card"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
