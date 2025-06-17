import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: Request) {
  try {
    const { extractedText, userQuery, chatHistory } = await req.json()

    if (!extractedText || !userQuery) {
      return NextResponse.json(
        { error: 'Extracted text and user query are required' },
        { status: 400 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const messages = [
      { role: 'system', content: 'You are an AI assistant specialized in analyzing screen content. Provide concise and helpful answers based on the provided extracted text.' },
      { role: 'user', content: `Here is the extracted text from the screen:\n\n"""\n${extractedText}\n"""\n\nBased on this, answer the following question: ${userQuery}` },
      ...chatHistory.map((msg: any) => ({ role: msg.role, content: msg.content }))
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
    })

    const aiResponse = response.choices[0].message.content

    return NextResponse.json({
      response: aiResponse
    })
  } catch (error: any) {
    console.error('Error in screen chat API:', error)
    return NextResponse.json(
      { error: `Failed to get AI response: ${error.message || error}` },
      { status: 500 }
    )
  }
} 