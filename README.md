# CareConnect - Frontend Prototype

A comprehensive healthcare application prototype featuring AI-powered diagnosis, patient management, and telemedicine capabilities. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core Features
- **Role-Based Authentication**: Separate login/signup flows for patients and doctors
- **Patient Symptom Submission**: Comprehensive form with image upload and validation
- **AI Diagnosis Results**: Mock AI analysis with confidence levels and recommendations
- **Doctor Dashboard**: Patient management with video call integration
- **Patient Dashboard**: Health records with search and pagination
- **Real-time Chat**: AI assistant and doctor messaging interface
- **Google Meet Integration**: One-click video consultations
- **Medical Records**: Complete patient history with filtering

### Advanced Features
- **PWA Support**: Installable app with offline capabilities
- **Push Notifications**: Appointment reminders and health alerts
- **Multi-language Support**: English and Hindi translations
- **Responsive Design**: Mobile-first approach with accessibility
- **Offline Mode**: Service worker with caching strategies

## Sample Login Credentials

### Patient Account
- **Email**: `patient@careconnect.com`
- **Password**: `patient123`
- **Name**: John Doe
- **Features**: Symptom reporting, AI diagnosis, medical records, chat

### Doctor Account
- **Email**: `doctor@careconnect.com`
- **Password**: `doctor123`
- **Name**: Dr. Sarah Smith
- **Features**: Patient management, video calls, schedule, analytics

> **Note**: These are mock credentials for demonstration. Any email/password combination will work as authentication is simulated.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **PWA**: Custom service worker implementation

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd careconnect-prototype
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Quick Start Guide

### Testing Patient Features
1. Go to [http://localhost:3000](http://localhost:3000)
2. Select **"Patient"** account type
3. Click **"Login"** tab
4. Enter: `patient@careconnect.com` / `patient123`
5. Explore: Dashboard → Report Symptoms → View Records → Chat

### Testing Doctor Features
1. Go to [http://localhost:3000](http://localhost:3000)
2. Select **"Doctor"** account type  
3. Click **"Login"** tab
4. Enter: `doctor@careconnect.com` / `doctor123`
5. Explore: Dashboard → Patient Queue → Video Calls → Schedule

### Testing PWA Features
- **Install App**: Look for install banner at top of page
- **Offline Mode**: Toggle using bottom-right offline indicator
- **Notifications**: Click bell icon in navigation
- **Language**: Switch between English/Hindi in top-right

## Usage Guide

### Getting Started
1. **Landing Page**: Choose between Patient or Doctor account type
2. **Authentication**: Use the sample credentials above (or any email/password)
3. **Dashboard**: Access role-specific features and navigation

### Patient Features
- **Report Symptoms**: Submit detailed symptom information with images
- **View AI Diagnosis**: Get mock AI analysis with recommendations
- **Medical Records**: Browse complete health history with search/filter
- **Chat Interface**: Communicate with AI assistant and doctors
- **Appointments**: Manage upcoming consultations

### Doctor Features
- **Patient Management**: View patient queue with priority levels
- **Video Consultations**: Start Google Meet calls with patients
- **Schedule Management**: Track daily appointments and tasks
- **Patient Records**: Access comprehensive patient information

### PWA Features
- **Install App**: Use the install banner for native app experience
- **Offline Mode**: Toggle offline simulation to test caching
- **Push Notifications**: Receive appointment and health reminders

## Development Features

### Mock Data
All features use comprehensive mock data located in `lib/mock-data.ts`:
- Patient profiles and medical history
- Doctor information and schedules
- Chat messages and notifications
- Appointment and consultation data

### Internationalization
Multi-language support with translations in `lib/translations.ts`:
- English (default)
- Hindi (हिंदी)
- Easy to extend for additional languages

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Accessible navigation and interactions
- WCAG compliance considerations

## Testing Features

### Offline Mode Simulation
1. Click the language toggle in the top navigation
2. Use the "Go Offline" button in the offline indicator
3. Test app functionality in offline state
4. Verify cached content and service worker behavior

### PWA Installation
1. Look for the install banner at the top of the page
2. Click "Install" to add to home screen
3. Test standalone app experience
4. Verify manifest.json configuration

### Notification System
1. Navigate to any dashboard
2. Click the notification bell icon
3. View mock notifications with different types
4. Test mark as read and clear functionality

## Mobile Experience

The app is optimized for mobile devices with:
- Touch-friendly interface elements
- Responsive navigation patterns
- Optimized form inputs and validation
- Mobile-specific PWA features

## Security Considerations

While this is a prototype with mock data, it includes:
- Client-side form validation
- Secure authentication UI patterns
- Privacy-focused design principles
- HTTPS-ready configuration

## Deployment

The app is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Firebase Hosting**

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

