import { NextResponse } from 'next/server'
import { Ollama } from 'langchain/llms/ollama'

export async function POST(req: Request) {
  try {
    const { message, step, problem, type } = await req.json()

    if (!message || !step || !problem || !type) {
      return NextResponse.json(
        { error: 'Message, step, problem, and type are required' },
        { status: 400 }
      )
    }

    const llm = new Ollama({
      baseUrl: 'http://localhost:11434',
      model: 'gemma:2b',
    })

    const prompt = `I'm helping a student understand a step in solving a ${type} problem.
Original problem: ${problem}
Current step: ${step}

Student's question: ${message}

Please provide a helpful and detailed response that:
1. Directly addresses the student's question
2. Provides additional context if needed
3. Uses clear and simple language
4. Includes examples if helpful
5. Encourages understanding rather than just memorization

Make your response conversational and supportive.`

    const response = await llm.call(prompt)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
} 