import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { topic, type, tone, length, additionalInfo } = await req.json()

    if (!topic || !type || !tone || !length) {
      return NextResponse.json(
        { error: 'All fields are required' },
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
            content: `Write a ${length} ${type} essay about "${topic}" in a ${tone} tone. Here is some additional information to consider: ${additionalInfo}, don't write in markdown.`
          }
        ],
        stream: false
      })
    })

    const data = await response.json()

    return NextResponse.json({
      essay: data.message.content
    })
  } catch (error) {
    console.error('Error generating essay:', error)
    return NextResponse.json(
      { error: 'Failed to generate essay' },
      { status: 500 }
    )
  }
} 