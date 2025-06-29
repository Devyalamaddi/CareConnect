import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber } = body

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const { spawn } = require('child_process')
    return new Promise((resolve) => {
      const pythonProcess = spawn('python', ['call_appointments_agent.py'], {
        env: {
          ...process.env,
          TARGET_PHONE: "+918019227239",
          ROLE: 'patient'
        }
      })
      let output = ''
      let errorOutput = ''
      pythonProcess.stdout.on('data', (data: Buffer) => {
        output += data.toString()
      })
      pythonProcess.stderr.on('data', (data: Buffer) => {
        errorOutput += data.toString()
      })
      pythonProcess.on('close', (code: number) => {
        if (code === 0) {
          resolve(NextResponse.json({ success: true, message: 'Patient call initiated', output }))
        } else {
          resolve(NextResponse.json({ success: false, error: errorOutput || output }, { status: 500 }))
        }
      })
    })
  }    catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 