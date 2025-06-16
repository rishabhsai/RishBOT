'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ScreenAnalysis() {
  const [results, setResults] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const captureScreen = async () => {
    try {
      setLoading(true)
      // Use the Screen Capture API
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
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
        
        // Convert to base64
        const image = canvas.toDataURL('image/png')
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        
        // Send to API
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
        setResults(`Error: ${data.error}`)
      } else {
        setResults(`Extracted Text:\n${data.text}\n\nConfidence: ${data.confidence}%`)
      }
    } catch (error) {
      console.error('Error analyzing screen:', error)
      setResults('Failed to analyze screen content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Screen Content Recognition</CardTitle>
        <CardDescription>
          Capture and analyze screen content, extract text, and detect mathematical equations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={captureScreen}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Capture Screen'}
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setResults('Feature coming soon...')}
            >
              Extract Text
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setResults('Feature coming soon...')}
            >
              Find Text
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setResults('Feature coming soon...')}
            >
              Detect Equations
            </Button>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Analysis Results</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {results || 'Capture screen content to see results here'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 