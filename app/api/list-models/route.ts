import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function GET() {
  try {
    const models = [
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest', 
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-pro',
      'gemini-pro-vision',
      'gemini-2.0-flash-exp'
    ]
    
    const results = []
    
    for (const modelName of models) {
      try {
        const model = gemini.getGenerativeModel({ model: modelName })
        // Try a simple test
        const result = await model.generateContent('Say "test"')
        results.push({
          model: modelName,
          available: true,
          response: result.response.text()
        })
      } catch (err: any) {
        results.push({
          model: modelName,
          available: false,
          error: err?.message || 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      apiKeyExists: !!process.env.GEMINI_API_KEY,
      models: results
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to test models',
      apiKeyExists: !!process.env.GEMINI_API_KEY
    }, { status: 500 })
  }
}
