import { NextResponse } from 'next/server'
import Tesseract from 'tesseract.js'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64')

    // Perform OCR
    const result = await Tesseract.recognize(
      imageBuffer,
      'eng',
      {
        logger: m => console.log(m)
      }
    )

    return NextResponse.json({
      text: result.data.text,
      confidence: result.data.confidence
    })
  } catch (error) {
    console.error('Error analyzing screen:', error)
    return NextResponse.json(
      { error: 'Failed to analyze screen content' },
      { status: 500 }
    )
  }
} 