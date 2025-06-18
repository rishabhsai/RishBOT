'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ProblemSolver() {
  const [problem, setProblem] = useState('')
  const [type, setType] = useState('math')
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  const solutionRef = useRef<HTMLDivElement>(null)
  const [showFollowUpInput, setShowFollowUpInput] = useState(false)
  const [followUp, setFollowUp] = useState('')
  const [followUpLoading, setFollowUpLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<{question: string, answer: string}[]>([])

  useEffect(() => {
    if (solutionRef.current) {
      if (typeof window !== 'undefined' && !(window as any).MathJax) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
        script.async = true
        script.onload = () => {
          if ((window as any).MathJax) {
            (window as any).MathJax.typeset()
          }
        }
        document.head.appendChild(script)
      } else if ((window as any).MathJax) {
        (window as any).MathJax.typesetPromise()
      }
    }
  }, [solution])

  const solveProblem = async () => {
    if (!problem.trim()) {
      setSolution('Please enter a problem to solve')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem, type }),
      })

      const data = await response.json()
      
      if (data.error) {
        setSolution(`Error: ${data.error}`)
      } else {
        setSolution(data.solution)
      }
    } catch (error) {
      console.error('Error solving problem:', error)
      setSolution('Failed to solve problem')
    } finally {
      setLoading(false)
    }
  }

  const sendFollowUp = async () => {
    if (!followUp.trim()) return
    try {
      setFollowUpLoading(true)
      const response = await fetch('/api/expand-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem,
          solution,
          followUp,
          type,
          history: chatHistory,
        }),
      })
      const data = await response.json()
      if (data.error) {
        setChatHistory(prev => [...prev, { question: followUp, answer: `Error: ${data.error}` }])
      } else {
        setChatHistory(prev => [...prev, { question: followUp, answer: data.expandedStep }])
      }
      setFollowUp('')
    } catch (error) {
      setChatHistory(prev => [...prev, { question: followUp, answer: 'Failed to get follow-up response' }])
    } finally {
      setFollowUpLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Math & Physics Problem Solver</CardTitle>
        <CardDescription>
          Get step-by-step solutions for mathematical equations and physics problems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select problem type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">Mathematical Equation</SelectItem>
                <SelectItem value="physics">Physics Problem</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Enter your problem here..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="min-h-[200px]"
            />
            <Button 
              className="w-full" 
              onClick={solveProblem}
              disabled={loading}
            >
              {loading ? 'Solving...' : 'Solve Problem'}
            </Button>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Solution</h3>
            <div ref={solutionRef} className="text-sm text-muted-foreground whitespace-pre-wrap">
              {solution || 'Enter a problem to see the solution here'}
            </div>
            {solution && !showFollowUpInput && (
              <Button className="mt-4" variant="outline" onClick={() => setShowFollowUpInput(true)}>
                Reply / Ask Follow-up
              </Button>
            )}
            {showFollowUpInput && (
              <div className="mt-4 space-y-2">
                <div className="flex flex-col gap-2">
                  {chatHistory.map((item, idx) => (
                    <div key={idx} className="bg-muted p-2 rounded border text-sm">
                      <div className="font-semibold text-primary">You:</div>
                      <div className="mb-1">{item.question}</div>
                      <div className="font-semibold text-primary">AI:</div>
                      <div>{item.answer}</div>
                    </div>
                  ))}
                </div>
                <Textarea
                  placeholder="Ask the AI to explain more, give an example, etc."
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={sendFollowUp} disabled={followUpLoading || !followUp.trim()}>
                  {followUpLoading ? 'Asking...' : 'Send'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 