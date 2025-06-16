'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ProblemSolver() {
  const [problem, setProblem] = useState('')
  const [type, setType] = useState('math')
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)

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
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {solution || 'Enter a problem to see the solution here'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 