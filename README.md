# 10xCards

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![Astro](https://img.shields.io/badge/Astro-5.5.5-orange.svg)
![Node](https://img.shields.io/badge/node-22.14.0-green.svg)

An AI-powered web application that automates the creation of educational flashcards. It enables users to generate, edit, and manage flashcards in a simple and intuitive way, making the spaced repetition learning method more accessible.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Features

- 🤖 AI-powered flashcard generation from text input
- ✏️ Inline flashcard editing
- 🗑️ Flashcard management (view, delete)
- 👤 User authentication system
- ✅ Input validation (200 chars for questions, 500 for answers)

## Tech Stack

### Frontend
- [Astro](https://astro.build/) 5
- [React](https://reactjs.org/) 19
- [TypeScript](https://www.typescriptlang.org/) 5
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Shadcn/ui](https://ui.shadcn.com/) - UI Components

### Backend & Database
- [Supabase](https://supabase.com/) - Backend as a Service

### AI Integration
- [Openrouter.ai](https://openrouter.ai/) - AI Models

### CI/CD & Hosting
- GitHub Actions
- DigitalOcean

## Getting Started

### Prerequisites

- Node.js 22.14.0
- npm or yarn
- Supabase account
- Openrouter.ai API key

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/10xcards.git
cd 10xcards
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
Create a \`.env\` file in the root directory with the following variables:
\`\`\`
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
\`\`\`

4. Start the development server
\`\`\`bash
npm run dev
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run astro\` - Run Astro CLI commands
- \`npm run lint\` - Run ESLint
- \`npm run lint:fix\` - Fix ESLint errors
- \`npm run format\` - Format code with Prettier

## Project Scope

### Current Features
- AI-powered flashcard generation
- Basic user authentication
- Flashcard management system
- Input validation

### Limitations
- No advanced spaced repetition algorithms (like SuperMemo or Anki)
- No support for multiple file format imports (PDF, DOCX, etc.)
- No flashcard set sharing between users
- No integration with other educational platforms
- Web version only (no mobile apps)

## Project Status

The project is currently in MVP (Minimum Viable Product) phase. The core features are being implemented with a focus on:
- AI-powered flashcard generation
- Basic user management
- Essential flashcard operations

### Success Metrics
- 75% of AI-generated flashcards are accepted by users
- 75% of flashcards are created using AI

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
