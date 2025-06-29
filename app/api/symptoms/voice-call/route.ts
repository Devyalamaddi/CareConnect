import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, patientName = "Demo Patient" } = body

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Call the Python script to initiate the voice AI call
    const { spawn } = require('child_process')
    
    return new Promise((resolve) => {
      const pythonProcess = spawn('python', ['call_symptom_screener.py'], {
        env: {
          ...process.env,
          TARGET_PHONE: phoneNumber,
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
          resolve(NextResponse.json({
            success: true,
            message: 'Voice AI call initiated successfully',
            output: output
          }))
        } else {
          resolve(NextResponse.json({
            success: false,
            error: 'Failed to initiate voice AI call',
            details: errorOutput || output
          }, { status: 500 }))
        }
      })
    })

  } catch (error) {
    console.error('Error initiating voice AI call:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 