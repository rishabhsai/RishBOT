'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export function EssayWriter() {
  const [topic, setTopic] = useState('')
  const [type, setType] = useState('argumentative')
  const [tone, setTone] = useState('formal')
  const [length, setLength] = useState('medium')
  const [essay, setEssay] = useState('')
  const [loading, setLoading] = useState(false)

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
        body: JSON.stringify({ topic, type, tone, length }),
      })

      const data = await response.json()
      
      if (data.error) {
        setEssay(`Error: ${data.error}`)
      } else {
        setEssay(data.essay)
      }
    } catch (error) {
      console.error('Error generating essay:', error)
      setEssay('Failed to generate essay')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Essay Writer</CardTitle>
        <CardDescription>
          Generate well-structured essays on any topic with customizable parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Input
              placeholder="Enter essay topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
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
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Generated Essay</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {essay || 'Enter a topic and parameters to generate an essay'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 