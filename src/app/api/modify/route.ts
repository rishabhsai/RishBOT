import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { text, context, type, tone, instruction } = await req.json()

    if (!text || !context || !type || !tone) {
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
            content: instruction ? 
              `Based on the following context and essay type/tone, please fulfill this request: "${instruction}". The original essay is a ${type} essay with a ${tone} tone. Here's the full essay: \n\n${context}\n\n${text ? `And here is the specific text to modify: ${text}` : ''}` :
              `Modify the following text to be more ${tone} while maintaining the same meaning. The text is part of a ${type} essay. Here's the full context:\n\n${context}\n\nText to modify:\n${text}`
          }
        ],
        stream: false
      })
    })

    const data = await response.json()

    return NextResponse.json({
      modifiedText: data.message.content
    })
  } catch (error) {
    console.error('Error modifying text:', error)
    return NextResponse.json(
      { error: 'Failed to modify text' },
      { status: 500 }
    )
  }
} 