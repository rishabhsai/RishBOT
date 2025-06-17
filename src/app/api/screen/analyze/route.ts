import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this image. Extract all visible text and provide a general summary or description of the content. If there are any mathematical equations, attempt to identify them.' },
            { type: 'image_url', image_url: { url: image } },
          ],
        },
      ],
    })

    const analysis = response.choices[0].message.content

    return NextResponse.json({
      text: analysis,
      confidence: 100 // OpenAI doesn't provide a confidence score like Tesseract, so we'll set a placeholder
    })
  } catch (error: any) {
    console.error('Error analyzing screen with OpenAI:', error)
    return NextResponse.json(
      { error: `Failed to analyze screen content: ${error.message || error}` },
      { status: 500 }
    )
  }
} 