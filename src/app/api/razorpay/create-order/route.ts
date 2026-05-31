import { NextRequest, NextResponse } from 'next/server'

// Both keys are server-only — secret NEVER goes to client
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export async function POST(req: NextRequest) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: 'Razorpay keys not configured. Add to .env.local' },
      { status: 500 }
    )
  }

  try {
    const { amount, currency = 'INR', planName = 'OfferOS Pro' } = await req.json()

    // amount must be in paise (₹499 = 49900)
    const amountInPaise = Math.round(amount * 100)

    const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: `offeros_${Date.now()}`,
        notes: { plan: planName },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Razorpay error: ${err}` }, { status: response.status })
    }

    const order = await response.json()

    // Return order ID + public key ID (safe to send to client)
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID, // Key ID is public-safe; secret never leaves server
    })
  } catch (err) {
    console.error('[razorpay/create-order] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
