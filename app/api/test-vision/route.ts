import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_VISION_API_KEY = 'AIzaSyBVJ0GoiJ21XyFpJoC3J65w5yVByCwLik4'

export async function GET() {
  try {
    console.log('Testing Vision API connection...')
    
    // First test: Check if API key is valid and API is enabled
    const testResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" // 1x1 red pixel
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 5
            }
          ]
        }]
      })
    })

    const status = testResponse.status
    const responseText = await testResponse.text()

    console.log('Vision API test status:', status)
    console.log('Vision API test response:', responseText)

    // Parse response to get more details
    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseText)
    } catch (e) {
      parsedResponse = { parseError: e instanceof Error ? e.message : String(e) }
    }

    return NextResponse.json({
      success: testResponse.ok,
      status: status,
      response: responseText,
      parsed: parsedResponse,
      timestamp: new Date().toISOString(),
      apiKey: GOOGLE_VISION_API_KEY.substring(0, 10) + '...' // Show partial key for verification
    })

  } catch (error: any) {
    console.error('Vision API test error:', error)
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}
