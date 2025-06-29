import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, patientName = "Demo Patient" } = body
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Call a Python script to interact with the agent (ID: 2461)
    return new Promise((resolve) => {
      const pythonProcess = spawn('python', ['send_to_healthbot.py'], {
        env: {
          ...process.env,
          AGENT_ID: '2461',
          USER_MESSAGE: message,
          PATIENT_NAME: patientName
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
          resolve(NextResponse.json({ success: true, response: output }))
        } else {
          resolve(NextResponse.json({ success: false, error: errorOutput || output }, { status: 500 }))
        }
      })
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 