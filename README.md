# TraceTask - Task Management with AI

A modern task management application built with React, TypeScript, and Firebase. Features AI-powered task descriptions using Groq's free API.

**Repository**: https://github.com/molchanovchess/tasks-test

## Features

- 🔐 **Authentication**: Email/password and Google OAuth via Firebase Auth
- 📋 **Task Management**: Organize tasks in Active, Blocked, and Closed columns
- 📝 **Checklist System**: Create checklists and add tasks to them
- 🤖 **AI Descriptions**: Auto-generate task descriptions using Groq AI
- ☁️ **Real-time Sync**: All data synced via Firebase Firestore
- 🚀 **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **AI**: Groq API (free tier)
- **Build**: Vite
- **Deployment**: Firebase Hosting

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- Groq account (free at https://console.groq.com)

### 1. Clone and Install

```bash
git clone https://github.com/molchanovchess/tasks-test.git
cd tracetasks
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Get your Firebase config from Project Settings

### 3. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Fill in your `.env` file:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket

# Groq API Key (free at https://console.groq.com)
VITE_GROQ_API_KEY=your_groq_api_key
```

### 4. Deploy Firestore Rules

```bash
# Initialize Firebase (one-time setup)
npx firebase-tools login
npx firebase-tools init

# Deploy security rules and indexes
npx firebase-tools deploy --only firestore
```

## Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Firebase Hosting

```bash
# Build and deploy
npm run build
npx firebase-tools deploy --only hosting
```

Your app will be available at: `https://your-project-id.web.app`

**Current live demo**: https://tracetasks-oleksii.web.app

## Project Structure

```
src/
├── lib/firebase.ts          # Firebase configuration
├── modules/
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Task management dashboard
│   ├── checklists/         # Checklist management
│   └── tasks/              # AI task creation
└── main.tsx                # App entry point
```

## Known Limitations

- Firestore indexes need time to build after first deployment
- AI descriptions require Groq API key (free tier: 14,000 requests/day)
- Cloud Functions require Firebase Blaze plan (currently using client-side AI)

## Contributing

1. Follow TypeScript strict mode
2. Use ESLint configuration provided
3. Keep components modular and reusable
4. Add proper error handling
