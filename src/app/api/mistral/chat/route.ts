import { NextRequest, NextResponse } from 'next/server'

// Server-only: MISTRAL_API_KEY is never sent to the browser
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

export async function POST(req: NextRequest) {
  if (!MISTRAL_API_KEY) {
    return NextResponse.json(
      { error: 'Mistral API key not configured. Add MISTRAL_API_KEY to .env.local' },
      { status: 500 }
    )
  }

  try {
    const { messages, mode } = await req.json()

    // System prompt varies by interview mode
    const systemPrompts: Record<string, string> = {
      behavioral: `You are a senior FAANG interviewer conducting a behavioral interview. 
Ask probing follow-up questions using the STAR method. Be encouraging but rigorous.
Give specific, actionable feedback. Keep responses under 150 words.`,

      technical: `You are a senior software engineer at Google conducting a technical interview.
Ask one algorithmic problem at a time. Guide the candidate with hints if they're stuck.
Discuss time/space complexity. Keep responses under 150 words.`,

      'system-design': `You are a principal engineer at Meta conducting a system design interview.
Ask about scale, bottlenecks, trade-offs, and technology choices.
Push back on vague answers. Keep responses under 150 words.`,
    }

    const systemPrompt = systemPrompts[mode] || systemPrompts.behavioral

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest', // free-tier friendly, fast
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Mistral error: ${err}` }, { status: response.status })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content ?? 'No response from AI.'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[mistral/chat] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
