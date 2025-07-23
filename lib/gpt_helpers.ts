import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: "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",
})

export interface GPTResponse {
  success: boolean
  data?: any
  message?: string
  error?: string
  tokens_used?: number
}

// Data cleaning prompts
const DATA_CLEANING_PROMPT = `
You are a data cleaning expert. Clean and format the messy sales data provided below.

Rules:
1. Extract seller names, sales amounts, returns, and calculate net amounts
2. Format all currency values as numbers (remove PKR, commas, etc.)
3. Standardize seller names (proper capitalization)
4. Calculate totals for all columns
5. Return only valid JSON in this exact format:

{
  "sellers": [
    {
      "name": "Seller Name",
      "sales": 0,
      "returns": 0,
      "net": 0
    }
  ],
  "totals": {
    "sales": 0,
    "returns": 0,
    "net": 0
  }
}

Data to clean:
`

const SALES_FORMATTING_PROMPT = `
Format the following sales data into a professional daily report.

Rules:
1. Clean seller names and amounts
2. Calculate net amounts (sales - returns)
3. Sort by highest net amount
4. Include totals and summary
5. Return structured JSON

Data:
`

const CITY_DETECTION_PROMPT = `
Analyze the following address and extract/standardize the city name.

Rules:
1. Identify the Pakistani city from the address
2. Return the standardized city name (proper capitalization)
3. If multiple cities mentioned, return the destination city
4. Return only the city name, nothing else

Address:
`

const COURIER_SUGGESTION_PROMPT = `
Suggest the best courier service for the following delivery details.

Consider:
1. Destination city and region
2. Package weight and value
3. Delivery urgency
4. Cost effectiveness

Available couriers: PostEx, BlueEx, TCS, Leopards, M&P, Call Courier, Trax

Return only the courier name and brief reason.

Details:
`

const ASSISTANT_SYSTEM_PROMPT = `
You are a helpful AI assistant for Lobocubs Courier Manager, a multi-courier management system.

You can help with:
- Tracking shipments
- Explaining courier services
- Formatting data
- Answering questions about the system
- Providing shipping advice

Be concise, helpful, and professional. If asked about specific tracking numbers, guide users to the tracking page.
`

export class GPTService {
  private logUsage = async (tenantId: string, userId: string, feature: string, tokens: number) => {
    try {
      // This would log to your database
      await fetch('/api/gpt/log-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          user_id: userId,
          feature,
          tokens_used: tokens
        })
      })
    } catch (error) {
      console.error('Failed to log GPT usage:', error)
    }
  }

  async cleanData(data: string, tenantId?: string, userId?: string): Promise<GPTResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: DATA_CLEANING_PROMPT + data
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      })

      const response = completion.choices[0]?.message?.content
      const tokensUsed = completion.usage?.total_tokens || 0

      if (tenantId && userId) {
        await this.logUsage(tenantId, userId, 'data_cleaning', tokensUsed)
      }

      if (!response) {
        return {
          success: false,
          error: 'No response from GPT'
        }
      }

      try {
        const parsedData = JSON.parse(response)
        return {
          success: true,
          data: parsedData,
          tokens_used: tokensUsed
        }
      } catch (parseError) {
        return {
          success: false,
          error: 'Failed to parse GPT response as JSON'
        }
      }
    } catch (error: any) {
      console.error('GPT cleanData error:', error)
      return {
        success: false,
        error: error.message || 'GPT service error'
      }
    }
  }

  async formatSalesReport(data: string, tenantId?: string, userId?: string): Promise<GPTResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: SALES_FORMATTING_PROMPT + data
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      })

      const response = completion.choices[0]?.message?.content
      const tokensUsed = completion.usage?.total_tokens || 0

      if (tenantId && userId) {
        await this.logUsage(tenantId, userId, 'sales_formatting', tokensUsed)
      }

      if (!response) {
        return {
          success: false,
          error: 'No response from GPT'
        }
      }

      try {
        const parsedData = JSON.parse(response)
        return {
          success: true,
          data: parsedData,
          tokens_used: tokensUsed
        }
      } catch (parseError) {
        return {
          success: true,
          data: { formatted_report: response },
          tokens_used: tokensUsed
        }
      }
    } catch (error: any) {
      console.error('GPT formatSalesReport error:', error)
      return {
        success: false,
        error: error.message || 'GPT service error'
      }
    }
  }

  async detectCity(address: string, tenantId?: string, userId?: string): Promise<GPTResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: CITY_DETECTION_PROMPT + address
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      })

      const response = completion.choices[0]?.message?.content?.trim()
      const tokensUsed = completion.usage?.total_tokens || 0

      if (tenantId && userId) {
        await this.logUsage(tenantId, userId, 'city_detection', tokensUsed)
      }

      return {
        success: true,
        data: { city: response },
        tokens_used: tokensUsed
      }
    } catch (error: any) {
      console.error('GPT detectCity error:', error)
      return {
        success: false,
        error: error.message || 'GPT service error'
      }
    }
  }

  async suggestCourier(details: string, tenantId?: string, userId?: string): Promise<GPTResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: COURIER_SUGGESTION_PROMPT + details
          }
        ],
        max_tokens: 150,
        temperature: 0.3
      })

      const response = completion.choices[0]?.message?.content
      const tokensUsed = completion.usage?.total_tokens || 0

      if (tenantId && userId) {
        await this.logUsage(tenantId, userId, 'courier_suggestion', tokensUsed)
      }

      return {
        success: true,
        data: { suggestion: response },
        tokens_used: tokensUsed
      }
    } catch (error: any) {
      console.error('GPT suggestCourier error:', error)
      return {
        success: false,
        error: error.message || 'GPT service error'
      }
    }
  }

  async chatAssistant(messages: any[], tenantId?: string, userId?: string): Promise<GPTResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: ASSISTANT_SYSTEM_PROMPT
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      const response = completion.choices[0]?.message?.content
      const tokensUsed = completion.usage?.total_tokens || 0

      if (tenantId && userId) {
        await this.logUsage(tenantId, userId, 'chat_assistant', tokensUsed)
      }

      return {
        success: true,
        data: { message: response },
        tokens_used: tokensUsed
      }
    } catch (error: any) {
      console.error('GPT chatAssistant error:', error)
      return {
        success: false,
        error: error.message || 'GPT service error'
      }
    }
  }

  async generateShipmentSummary(shipments: any[], tenantId?: string, userId?: string): Promise<GPTResponse> {
    try {
      const prompt = `
        Generate a brief summary of these shipments:
        
        ${JSON.stringify(shipments, null, 2)}
        
        Include:
        - Total shipments
        - Status breakdown
        - Top destinations
        - Any patterns or insights
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.5
      })

      const response = completion.choices[0]?.message?.content
      const tokensUsed = completion.usage?.total_tokens || 0

      if (tenantId && userId) {
        await this.logUsage(tenantId, userId, 'shipment_summary', tokensUsed)
      }

      return {
        success: true,
        data: { summary: response },
        tokens_used: tokensUsed
      }
    } catch (error: any) {
      console.error('GPT generateShipmentSummary error:', error)
      return {
        success: false,
        error: error.message || 'GPT service error'
      }
    }
  }
}

// Export singleton instance
export const gptService = new GPTService()

// Utility functions
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 0.75 words
  const words = text.split(/\s+/).length
  return Math.ceil(words / 0.75)
}

export function validateGPTResponse(response: string): boolean {
  try {
    JSON.parse(response)
    return true
  } catch {
    return false
  }
}

export function sanitizeGPTInput(input: string): string {
  // Remove potential harmful content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .substring(0, 10000) // Limit length
}
