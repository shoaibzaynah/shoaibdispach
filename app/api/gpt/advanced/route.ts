import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { advancedGPT } from '@/lib/gptAdvanced'

export async function POST(req: NextRequest) {
  try {
    const { message, conversation_history } = await req.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Process the advanced query
    const result = await advancedGPT.processAdvancedQuery(
      user.id,
      message,
      conversation_history || []
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Get user tenant_id for logging
    const { data: userData } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    // Log the interaction
    await supabase.from('gpt_logs').insert({
      user_id: user.id,
      tenant_id: userData?.tenant_id,
      feature: 'advanced_assistant',
      prompt: message,
      response: result.message,
      tokens_used: result.tokens_used,
      function_called: result.function_called
    })

    return NextResponse.json({
      success: true,
      data: {
        message: result.message,
        function_called: result.function_called,
        function_result: result.function_result
      }
    })

  } catch (error: any) {
    console.error('Advanced GPT API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
