import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      phoneNumber,
      patientName = "Demo Patient",
      medicineName = "Paracetamol",
      dosage = "1 tablet",
      reminderTime = "20:00"
    } = body

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Call the Python script to initiate the med-reminder call
    const { spawn } = require('child_process')
    
    return new Promise((resolve) => {
      const pythonProcess = spawn('python', ['call_med_reminder.py'], {
        env: {
          ...process.env,
          TARGET_PHONE: phoneNumber,
          PATIENT_NAME: patientName,
          MEDICINE_NAME: medicineName,
          DOSAGE: dosage,
          REMINDER_TIME: reminderTime
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
            message: 'Med-reminder call initiated successfully',
            output: output,
            callDetails: {
              phoneNumber,
              patientName,
              medicineName,
              dosage,
              reminderTime
            }
          }))
        } else {
          resolve(NextResponse.json({
            success: false,
            error: 'Failed to initiate med-reminder call',
            details: errorOutput || output
          }, { status: 500 }))
        }
      })
    })

  } catch (error) {
    console.error('Error initiating med-reminder call:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 