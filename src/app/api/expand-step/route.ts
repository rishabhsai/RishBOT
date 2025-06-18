import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { problem, solution, followUp, type, history } = await req.json()

    if (!problem || !solution || !followUp || !type) {
      return NextResponse.json(
        { error: 'Problem, solution, followUp, and type are required' },
        { status: 400 }
      )
    }

    let historyText = ''
    if (history && Array.isArray(history)) {
      history.forEach((item, idx) => {
        historyText += `\n\nQ${idx+1}: ${item.question}\nA${idx+1}: ${item.answer}`
      })
    }

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
            content: `You are an expert at explaining ${type} problems. Here is the original problem and the solution provided so far. The user may ask follow-up questions. Always get straight to the point. Do NOT say things like 'Sure' or 'Here's a detailed response to the follow-up question:'—just answer directly.\n\nOriginal problem: ${problem}\nSolution so far: ${solution}${historyText}\nFollow-up request: ${followUp}\n\nRespond to the follow-up in detail, concisely, and explain`
          }
        ],
        stream: false
      })
    })

    const data = await response.json()
    return NextResponse.json({ expandedStep: data.message.content })
  } catch (error) {
    console.error('Error expanding step:', error)
    return NextResponse.json(
      { error: 'Failed to expand step' },
      { status: 500 }
    )
  }
} 