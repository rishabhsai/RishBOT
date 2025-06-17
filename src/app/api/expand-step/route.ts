import { NextResponse } from 'next/server'
import { Ollama } from 'langchain/llms/ollama'

export async function POST(req: Request) {
  try {
    const { step, problem, type } = await req.json()

    if (!step || !problem || !type) {
      return NextResponse.json(
        { error: 'Step, problem, and type are required' },
        { status: 400 }
      )
    }

    const llm = new Ollama({
      baseUrl: 'http://localhost:11434',
      model: 'gemma:2b',
    })

    const prompt = `I need a more detailed explanation for this step in solving a ${type} problem.
Original problem: ${problem}
Current step: ${step}

Please provide a more detailed explanation of this step, including:
1. Why this step is necessary
2. The mathematical/physical principles involved
3. Any formulas or concepts used
4. Common mistakes to avoid
5. Tips for understanding this step better

Make the explanation clear and easy to understand.`

    const expandedContent = await llm.call(prompt)

    return NextResponse.json({ expandedContent })
  } catch (error) {
    console.error('Error expanding step:', error)
    return NextResponse.json(
      { error: 'Failed to expand step' },
      { status: 500 }
    )
  }
} 