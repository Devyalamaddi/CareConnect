import { NextRequest, NextResponse } from 'next/server'

// Change this to your deployed backend URL in production
const PY_BACKEND_URL = process.env.PY_BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, booking_date, booking_time } = body

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const res = await fetch(`${PY_BACKEND_URL}/call-doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 