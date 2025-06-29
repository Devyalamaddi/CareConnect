import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      phoneNumber, 
      patientName = "Demo Patient",
      surgeryType = "General Surgery",
      daysPostOp = "3"
    } = body

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Call the Python script to initiate the post-op follow-up call
    const { spawn } = require('child_process')
    
    return new Promise((resolve) => {
      const pythonProcess = spawn('python', ['call_postop_followup.py'], {
        env: {
          ...process.env,
          TARGET_PHONE: phoneNumber,
          PATIENT_NAME: patientName,
          SURGERY_TYPE: surgeryType,
          DAYS_POST_OP: daysPostOp
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
            message: 'Post-op follow-up call initiated successfully',
            output: output,
            callDetails: {
              phoneNumber,
              patientName,
              surgeryType,
              daysPostOp
            }
          }))
        } else {
          resolve(NextResponse.json({
            success: false,
            error: 'Failed to initiate post-op follow-up call',
            details: errorOutput || output
          }, { status: 500 }))
        }
      })
    })

  } catch (error) {
    console.error('Error initiating post-op follow-up call:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 