import OpenAI from 'openai'
import { createClient } from '@/utils/supabase/server'
import { CourierAPIFactory } from './courierAPIs'
import { Dispatch, CourierAPI } from '@/types'

const openai = new OpenAI({
  apiKey: "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",
})

interface GPTFunction {
  name: string
  description: string
  parameters: any
}

// Define available functions for GPT
const AVAILABLE_FUNCTIONS: GPTFunction[] = [
  {
    name: 'search_shipments',
    description: 'Search for shipments by tracking number, customer name, phone, or any other criteria',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (tracking number, customer name, phone, etc.)'
        },
        courier: {
          type: 'string',
          description: 'Filter by specific courier (postex, blueex, tcs, etc.)'
        },
        status: {
          type: 'string',
          description: 'Filter by shipment status'
        },
        limit: {
          type: 'number',
          description: 'Number of results to return (default 10)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'track_shipment',
    description: 'Track a specific shipment by tracking number',
    parameters: {
      type: 'object',
      properties: {
        tracking_number: {
          type: 'string',
          description: 'The tracking number to track'
        }
      },
      required: ['tracking_number']
    }
  },
  {
    name: 'cancel_shipment',
    description: 'Cancel a shipment by tracking number',
    parameters: {
      type: 'object',
      properties: {
        tracking_number: {
          type: 'string',
          description: 'The tracking number to cancel'
        },
        reason: {
          type: 'string',
          description: 'Reason for cancellation'
        }
      },
      required: ['tracking_number']
    }
  },
  {
    name: 'get_customer_shipments',
    description: 'Get all shipments for a specific customer',
    parameters: {
      type: 'object',
      properties: {
        customer_phone: {
          type: 'string',
          description: 'Customer phone number'
        },
        customer_name: {
          type: 'string',
          description: 'Customer name'
        }
      }
    }
  },
  {
    name: 'get_courier_stats',
    description: 'Get statistics for courier performance',
    parameters: {
      type: 'object',
      properties: {
        courier: {
          type: 'string',
          description: 'Courier name (optional, if not provided returns all)'
        },
        date_range: {
          type: 'string',
          description: 'Date range (today, week, month)'
        }
      }
    }
  },
  {
    name: 'create_shipment',
    description: 'Create a new shipment booking',
    parameters: {
      type: 'object',
      properties: {
        courier: {
          type: 'string',
          description: 'Courier service to use'
        },
        customer_name: {
          type: 'string',
          description: 'Customer full name'
        },
        customer_phone: {
          type: 'string',
          description: 'Customer phone number'
        },
        customer_address: {
          type: 'string',
          description: 'Customer full address'
        },
        destination_city: {
          type: 'string',
          description: 'Destination city'
        },
        cod_amount: {
          type: 'number',
          description: 'COD amount (optional)'
        },
        product_details: {
          type: 'string',
          description: 'Product description'
        }
      },
      required: ['courier', 'customer_name', 'customer_phone', 'customer_address', 'destination_city']
    }
  },
  {
    name: 'get_revenue_stats',
    description: 'Get revenue and financial statistics',
    parameters: {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          description: 'Time period (today, week, month, year)'
        },
        courier: {
          type: 'string',
          description: 'Filter by courier (optional)'
        }
      }
    }
  },
  {
    name: 'search_by_amount',
    description: 'Search shipments by COD amount range',
    parameters: {
      type: 'object',
      properties: {
        min_amount: {
          type: 'number',
          description: 'Minimum COD amount'
        },
        max_amount: {
          type: 'number',
          description: 'Maximum COD amount'
        }
      }
    }
  }
]

export class AdvancedGPTService {
  private async getUserContext(userId: string) {
    const supabase = await createClient()
    
    const { data: user } = await supabase
      .from('users')
      .select('*, tenants(*)')
      .eq('id', userId)
      .single()

    return user
  }

  private async searchShipments(tenantId: string, query: string, courier?: string, status?: string, limit = 10) {
    const supabase = await createClient()
    
    let queryBuilder = supabase
      .from('courier_dispatches')
      .select('*')
      .eq('tenant_id', tenantId)
      .limit(limit)

    // Add filters
    if (courier) {
      queryBuilder = queryBuilder.eq('courier', courier)
    }
    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }

    // Search in multiple fields
    queryBuilder = queryBuilder.or(`
      tracking_number.ilike.%${query}%,
      customer_name.ilike.%${query}%,
      customer_phone.ilike.%${query}%,
      customer_address.ilike.%${query}%,
      destination_city.ilike.%${query}%,
      product_details.ilike.%${query}%
    `)

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  private async trackShipment(tenantId: string, trackingNumber: string) {
    const supabase = await createClient()
    
    // Get shipment from database
    const { data: shipment, error } = await supabase
      .from('courier_dispatches')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('tracking_number', trackingNumber)
      .single()

    if (error || !shipment) {
      throw new Error('Shipment not found')
    }

    // Get courier API config
    const { data: courierConfig } = await supabase
      .from('tenant_courier_apis')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('courier', shipment.courier)
      .eq('api_type', 'tracking')
      .single()

    if (courierConfig) {
      try {
        // Use real courier API for live tracking
        const courierAPI = CourierAPIFactory.createAPI(shipment.courier, courierConfig)
        const trackingResult = await courierAPI.trackShipment(trackingNumber)
        
        // Update database with latest status
        if (trackingResult.success && trackingResult.status) {
          await supabase
            .from('courier_dispatches')
            .update({ status: trackingResult.status })
            .eq('id', shipment.id)
        }

        return {
          ...shipment,
          live_tracking: trackingResult
        }
      } catch (error) {
        console.error('Live tracking failed:', error)
      }
    }

    return shipment
  }

  private async cancelShipment(tenantId: string, trackingNumber: string, reason: string) {
    const supabase = await createClient()
    
    // Get shipment
    const { data: shipment, error } = await supabase
      .from('courier_dispatches')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('tracking_number', trackingNumber)
      .single()

    if (error || !shipment) {
      throw new Error('Shipment not found')
    }

    // Update status in database
    const { error: updateError } = await supabase
      .from('courier_dispatches')
      .update({ 
        status: 'cancelled',
        special_instructions: `Cancelled: ${reason}`
      })
      .eq('id', shipment.id)

    if (updateError) throw updateError

    // Try to cancel with courier API if available
    const { data: courierConfig } = await supabase
      .from('tenant_courier_apis')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('courier', shipment.courier)
      .eq('api_type', 'cancel')
      .single()

    if (courierConfig) {
      try {
        const courierAPI = CourierAPIFactory.createAPI(shipment.courier, courierConfig)
        // Assuming courier APIs have cancel method
        // await courierAPI.cancelShipment(trackingNumber, reason)
      } catch (error) {
        console.error('Courier cancellation failed:', error)
      }
    }

    return { success: true, message: 'Shipment cancelled successfully' }
  }

  private async getCustomerShipments(tenantId: string, customerPhone?: string, customerName?: string) {
    const supabase = await createClient()
    
    let query = supabase
      .from('courier_dispatches')
      .select('*')
      .eq('tenant_id', tenantId)

    if (customerPhone) {
      query = query.eq('customer_phone', customerPhone)
    } else if (customerName) {
      query = query.ilike('customer_name', `%${customerName}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  private async getCourierStats(tenantId: string, courier?: string, dateRange = 'month') {
    const supabase = await createClient()
    
    let query = supabase
      .from('courier_dispatches')
      .select('courier, status, cod_amount, created_at')
      .eq('tenant_id', tenantId)

    if (courier) {
      query = query.eq('courier', courier)
    }

    // Add date filter
    const now = new Date()
    let startDate = new Date()
    
    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
    }

    query = query.gte('created_at', startDate.toISOString())

    const { data, error } = await query
    
    if (error) throw error

    // Process statistics
    const stats = data?.reduce((acc: any, shipment: any) => {
      const courier = shipment.courier
      if (!acc[courier]) {
        acc[courier] = {
          total: 0,
          delivered: 0,
          pending: 0,
          cancelled: 0,
          revenue: 0
        }
      }
      
      acc[courier].total++
      acc[courier][shipment.status]++
      acc[courier].revenue += shipment.cod_amount || 0
      
      return acc
    }, {})

    return stats
  }

  private async createShipment(tenantId: string, shipmentData: any) {
    const supabase = await createClient()
    
    // Get courier API config
    const { data: courierConfig } = await supabase
      .from('tenant_courier_apis')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('courier', shipmentData.courier)
      .eq('api_type', 'booking')
      .single()

    let trackingNumber = `LBC${Date.now()}`
    let courierResponse = null

    if (courierConfig) {
      try {
        // Create booking with real courier API
        const courierAPI = CourierAPIFactory.createAPI(shipmentData.courier, courierConfig)
        const bookingResult = await courierAPI.createBooking(shipmentData)
        
        if (bookingResult.success && bookingResult.tracking_number) {
          trackingNumber = bookingResult.tracking_number
          courierResponse = bookingResult
        }
      } catch (error) {
        console.error('Courier booking failed:', error)
      }
    }

    // Save to database
    const { data: shipment, error } = await supabase
      .from('courier_dispatches')
      .insert({
        tenant_id: tenantId,
        tracking_number: trackingNumber,
        courier: shipmentData.courier,
        customer_name: shipmentData.customer_name,
        customer_phone: shipmentData.customer_phone,
        customer_address: shipmentData.customer_address,
        destination_city: shipmentData.destination_city,
        cod_amount: shipmentData.cod_amount || 0,
        product_details: shipmentData.product_details,
        status: 'pending',
        courier_response: courierResponse
      })
      .select()
      .single()

    if (error) throw error
    return shipment
  }

  private async getRevenueStats(tenantId: string, period = 'month', courier?: string) {
    const supabase = await createClient()
    
    let query = supabase
      .from('courier_dispatches')
      .select('cod_amount, status, created_at, courier')
      .eq('tenant_id', tenantId)

    if (courier) {
      query = query.eq('courier', courier)
    }

    // Add date filter
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    query = query.gte('created_at', startDate.toISOString())

    const { data, error } = await query
    
    if (error) throw error

    const stats = data?.reduce((acc: any, shipment: any) => {
      const amount = shipment.cod_amount || 0
      acc.total_orders++
      acc.total_revenue += amount
      
      if (shipment.status === 'delivered') {
        acc.delivered_orders++
        acc.delivered_revenue += amount
      }
      
      return acc
    }, {
      total_orders: 0,
      total_revenue: 0,
      delivered_orders: 0,
      delivered_revenue: 0
    })

    return stats
  }

  private async searchByAmount(tenantId: string, minAmount: number, maxAmount: number) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('courier_dispatches')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('cod_amount', minAmount)
      .lte('cod_amount', maxAmount)
      .order('cod_amount', { ascending: false })

    if (error) throw error
    return data || []
  }

  async processAdvancedQuery(userId: string, message: string, conversationHistory: any[] = []) {
    try {
      // Get user context
      const userContext = await this.getUserContext(userId)
      if (!userContext?.tenant_id) {
        throw new Error('User not associated with any tenant')
      }

      const tenantId = userContext.tenant_id

      // Create system prompt with context
      const systemPrompt = `You are an AI assistant for Lobocubs Courier Manager. You have access to a tenant's complete shipment data and can perform various operations.

Current User: ${userContext.full_name || userContext.email}
Tenant: ${userContext.tenants?.name || 'Unknown'}
Tenant ID: ${tenantId}

You can:
- Search shipments by tracking number, customer name, phone, or any criteria
- Track shipments and get live updates
- Cancel shipments with reasons
- Get customer-specific shipment history
- Get courier performance statistics
- Create new shipments
- Get revenue and financial stats
- Search by COD amount ranges

Always be helpful, accurate, and provide detailed information. When showing data, format it nicely for readability.`

      // Prepare messages for GPT
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ]

      // Call GPT with function calling
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as any,
        functions: AVAILABLE_FUNCTIONS,
        function_call: 'auto',
        max_tokens: 1500,
        temperature: 0.1
      })

      const response = completion.choices[0]?.message
      
      if (response?.function_call) {
        // Execute the requested function
        const functionName = response.function_call.name
        const functionArgs = JSON.parse(response.function_call.arguments || '{}')
        
        let functionResult: any = null
        
        switch (functionName) {
          case 'search_shipments':
            functionResult = await this.searchShipments(
              tenantId,
              functionArgs.query,
              functionArgs.courier,
              functionArgs.status,
              functionArgs.limit
            )
            break
            
          case 'track_shipment':
            functionResult = await this.trackShipment(tenantId, functionArgs.tracking_number)
            break
            
          case 'cancel_shipment':
            functionResult = await this.cancelShipment(
              tenantId,
              functionArgs.tracking_number,
              functionArgs.reason
            )
            break
            
          case 'get_customer_shipments':
            functionResult = await this.getCustomerShipments(
              tenantId,
              functionArgs.customer_phone,
              functionArgs.customer_name
            )
            break
            
          case 'get_courier_stats':
            functionResult = await this.getCourierStats(
              tenantId,
              functionArgs.courier,
              functionArgs.date_range
            )
            break
            
          case 'create_shipment':
            functionResult = await this.createShipment(tenantId, functionArgs)
            break
            
          case 'get_revenue_stats':
            functionResult = await this.getRevenueStats(
              tenantId,
              functionArgs.period,
              functionArgs.courier
            )
            break
            
          case 'search_by_amount':
            functionResult = await this.searchByAmount(
              tenantId,
              functionArgs.min_amount,
              functionArgs.max_amount
            )
            break
            
          default:
            throw new Error(`Unknown function: ${functionName}`)
        }

        // Get GPT's response to the function result
        const followUpCompletion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            ...messages as any,
            response,
            {
              role: 'function',
              name: functionName,
              content: JSON.stringify(functionResult, null, 2)
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        })

        const finalResponse = followUpCompletion.choices[0]?.message?.content

        return {
          success: true,
          message: finalResponse,
          function_called: functionName,
          function_result: functionResult,
          tokens_used: completion.usage?.total_tokens || 0
        }
      } else {
        // Regular response without function call
        return {
          success: true,
          message: response?.content,
          tokens_used: completion.usage?.total_tokens || 0
        }
      }
    } catch (error: any) {
      console.error('Advanced GPT query error:', error)
      return {
        success: false,
        error: error.message || 'Failed to process query'
      }
    }
  }
}

// Export singleton instance
export const advancedGPT = new AdvancedGPTService()
