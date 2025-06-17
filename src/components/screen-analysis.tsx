'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function ScreenAnalysis() {
  const [results, setResults] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [searchText, setSearchText] = useState<string>('')
  const [foundMatches, setFoundMatches] = useState<number>(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState<string>('')
  const [chatLoading, setChatLoading] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(true)
  const [showConsentDialog, setShowConsentDialog] = useState(false)
  const [attemptingLocalProcess, setAttemptingLocalProcess] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).MathJax) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (sheetOpen && chatScrollRef.current && (window as any).MathJax) {
      if ((window as any).MathJax.texReset) {
        (window as any).MathJax.texReset();
      }

      (window as any).MathJax.typesetPromise().then(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      });
    }
  }, [chatMessages, results, sheetOpen])

  const handleCaptureRequest = () => {
    setAttemptingLocalProcess(true);
    setTimeout(() => {
      setAttemptingLocalProcess(false);
      setShowConsentDialog(true);
    }, 1500);
  };

  const captureScreen = async () => {
    setShowConsentDialog(false);
    try {
      setLoading(true)
      setResults('')
      setCapturedImage(null)
      setFoundMatches(0)
      setChatMessages([])
      setSheetOpen(true)

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      })
      const video = document.createElement('video')
      video.srcObject = stream
      
      video.onloadedmetadata = () => {
        video.play()
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(video, 0, 0)
        
        const image = canvas.toDataURL('image/png')
        setCapturedImage(image)
        
        stream.getTracks().forEach(track => track.stop())
        
        analyzeScreen(image)
      }
    } catch (error) {
      console.error('Error capturing screen:', error)
      setResults('Failed to capture screen')
      setLoading(false)
    }
  }

  const analyzeScreen = async (image: string) => {
    try {
      const response = await fetch('/api/screen/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      })

      const data = await response.json()
      
      if (data.error) {
        setResults(`Error analyzing screen: ${data.error}`)
      } else {
        setResults(data.text)
      }
    } catch (error: any) {
      console.error('Error analyzing screen in frontend:', error)
      setResults(`Failed to analyze screen content due to network or unexpected error: ${error.message || error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFindText = () => {
    if (searchText.trim() === '' || !results) {
      setFoundMatches(0)
      return
    }
    const regex = new RegExp(searchText.trim(), 'gi')
    const matches = results.match(regex)
    setFoundMatches(matches ? matches.length : 0)
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !results) return

    const newUserMessage: ChatMessage = { role: 'user', content: chatInput }
    setChatMessages(prev => [...prev, newUserMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      const response = await fetch('/api/screen/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extractedText: results,
          userQuery: newUserMessage.content,
          chatHistory: chatMessages,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch (error: any) {
      console.error('Error sending chat message:', error)
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Failed to get a response from the AI.' }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Screen Content Recognition & Chat</CardTitle>
          <CardDescription>
            Capture and analyze screen content, then chat with AI about it.
          </CardDescription>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">{sheetOpen ? "Hide Chat" : "Show Chat"}</Button>
          </SheetTrigger>
          <SheetContent className="w-full md:max-w-[700px] lg:max-w-[900px] flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>Analysis & Chat</SheetTitle>
              <SheetDescription>
                {loading ? "Analyzing..." : "Review screen analysis and chat with the AI."}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 flex flex-col py-4 overflow-hidden">
              <ScrollArea className="flex-1 pr-4" ref={chatScrollRef}>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {results && (
                    <div className="mb-4 p-2 rounded-lg bg-gray-800 text-gray-100">
                      <h4 className="font-semibold mb-1">Initial Analysis:</h4>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[[rehypeKatex, { strict: 'ignore' }]]}
                      >
                        {results}
                      </ReactMarkdown>
                    </div>
                  )}
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-100'}`}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[[rehypeKatex, { strict: 'ignore' }]]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {results && (
                <div className="flex items-center space-x-2 mt-auto pt-4 border-t">
                  <Input
                    placeholder="Ask a question about the screen..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') sendChatMessage()
                    }}
                    disabled={chatLoading}
                  />
                  <Button onClick={sendChatMessage} disabled={chatLoading || !chatInput.trim()}>
                    {chatLoading ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden">
        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={handleCaptureRequest}
            disabled={loading || attemptingLocalProcess}
          >
            {attemptingLocalProcess ? 'Attempting local processing...' : (loading ? 'Processing...' : 'Capture and Analyze Screen')}
          </Button>

          {capturedImage && (
            <div className="space-y-2">
              <h3 className="font-semibold">Captured Image</h3>
              <img src={capturedImage} alt="Captured Screen" className="max-w-full h-auto rounded-md border" />
            </div>
          )}

          <div className="space-y-2">
            <Input
              placeholder="Text to find..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleFindText}
              disabled={!results || loading}
            >
              Find Text ({foundMatches} matches)
            </Button>
          </div>

          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => setResults('Feature coming soon...')}
            disabled={loading}
          >
            Detect Equations (Coming Soon)
          </Button>
        </div>
      </CardContent>
      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Local Processing Unavailable</DialogTitle>
            <DialogDescription>
              Your machine currently cannot handle local image analysis for screen content. To ensure you receive accurate and timely results, the image captured from your screen needs to be analyzed using OpenAI's cloud-based AI models.
              By proceeding, you consent to sending your screen image data to OpenAI for processing. Is this acceptable?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConsentDialog(false)}>Cancel</Button>
            <Button onClick={captureScreen}>Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 