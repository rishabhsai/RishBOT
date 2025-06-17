'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'

export function EssayWriter() {
  const [topic, setTopic] = useState('')
  const [type, setType] = useState('argumentative')
  const [tone, setTone] = useState('formal')
  const [length, setLength] = useState('medium')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [essay, setEssay] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEssay, setShowEssay] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [isModifying, setIsModifying] = useState(false)
  const essayRef = useRef<HTMLTextAreaElement>(null)
  const [sheetOpen, setSheetOpen] = useState(true)
  const [modificationPrompt, setModificationPrompt] = useState('')
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    if (essayRef.current) {
      essayRef.current.style.height = 'auto';
      essayRef.current.style.height = essayRef.current.scrollHeight + 'px';
    }
    setWordCount(essay.split(/\s+/).filter(Boolean).length);
  }, [essay]);

  const generateEssay = async () => {
    if (!topic.trim()) {
      setEssay('Please enter a topic for your essay')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, type, tone, length, additionalInfo }),
      })

      const data = await response.json()
      
      if (data.error) {
        setEssay(`Error: ${data.error}`)
      } else {
        setEssay(data.essay)
        setShowEssay(true)
        setSheetOpen(false)
      }
    } catch (error) {
      console.error('Error generating essay:', error)
      setEssay('Failed to generate essay')
    } finally {
      setLoading(false)
    }
  }

  const handleTextSelection = () => {
    const textarea = essayRef.current;
    if (textarea) {
      const selected = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
      setSelectedText(selected.trim());
    }
  }

  const modifySelectedText = async () => {
    if (!selectedText && !modificationPrompt.trim()) return

    try {
      setIsModifying(true)
      const response = await fetch('/api/modify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: selectedText || modificationPrompt,
          context: essay,
          type,
          tone,
          instruction: modificationPrompt
        }),
      })

      const data = await response.json()
      
      if (data.error) {
        console.error('Error modifying text:', data.error)
      } else {
        let newEssay = essay;
        if (selectedText) {
          newEssay = essay.replace(selectedText, data.modifiedText)
        } else {
          newEssay = data.modifiedText;
        }
        setEssay(newEssay)
        setSelectedText('')
        setModificationPrompt('')
      }
    } catch (error) {
      console.error('Error modifying text:', error)
    } finally {
      setIsModifying(false)
    }
  }

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Essay Writer</CardTitle>
          <CardDescription>
            Generate and refine essays with AI assistance
          </CardDescription>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">{sheetOpen ? "Hide Controls" : "Show Controls"}</Button>
          </SheetTrigger>
          <SheetContent className="w-80 sm:w-96">
            <SheetHeader>
              <SheetTitle>Essay Parameters</SheetTitle>
              <SheetDescription>
                Adjust settings and generate your essay.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-10rem)] p-4">
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Enter essay topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <Textarea
                  placeholder="Enter additional information or context..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="min-h-[100px]"
                />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select essay type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="argumentative">Argumentative</SelectItem>
                    <SelectItem value="descriptive">Descriptive</SelectItem>
                    <SelectItem value="narrative">Narrative</SelectItem>
                    <SelectItem value="expository">Expository</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (300-500 words)</SelectItem>
                    <SelectItem value="medium">Medium (500-800 words)</SelectItem>
                    <SelectItem value="long">Long (800-1200 words)</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full" 
                  onClick={generateEssay}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Essay'}
                </Button>
                {essay && (
                  <div className="mt-6 space-y-4 border-t pt-4">
                    <h4 className="font-semibold">Refine Essay</h4>
                    {selectedText && (
                      <p className="text-sm text-muted-foreground">Selected: <span className="font-medium">{selectedText}</span></p>
                    )}
                    <Textarea
                      placeholder={selectedText ? "How do you want to modify the selected text?" : "Enter instructions to modify the essay..."}
                      value={modificationPrompt}
                      onChange={(e) => setModificationPrompt(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button 
                      className="w-full"
                      onClick={modifySelectedText}
                      disabled={isModifying || (!selectedText && !modificationPrompt.trim())}
                    >
                      {isModifying ? 'Modifying...' : 'Modify Essay'}
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden relative">
        <Textarea
          ref={essayRef}
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          onMouseUp={handleTextSelection}
          className="w-full h-full text-sm text-foreground whitespace-pre-wrap resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Generate an essay to see it here..."
        />
        <div className="absolute bottom-2 left-4 text-lg text-muted-foreground">
          Word Count: {wordCount}
        </div>
      </CardContent>
    </Card>
  )
} 