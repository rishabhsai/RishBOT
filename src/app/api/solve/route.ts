import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { problem, type } = await req.json()

    if (!problem || !type) {
      return NextResponse.json(
        { error: 'Problem and type are required' },
        { status: 400 }
      )
    }

    // Call Ollama API
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma:2b',
        messages: [
          {
            role: 'user',
            content: `Solve this ${type} problem step by step: ${problem}`
          }
        ],
        stream: false
      })
    })

    const data = await response.json()

    return NextResponse.json({
      solution: data.message.content
    })
  } catch (error) {
    console.error('Error solving problem:', error)
    return NextResponse.json(
      { error: 'Failed to solve problem' },
      { status: 500 }
    )
  }
} 