# 10xCards

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![Astro](https://img.shields.io/badge/Astro-5.5.5-orange.svg)
![Node](https://img.shields.io/badge/node-22.14.0-green.svg)

An AI-powered web application that automates the creation of educational flashcards. It enables users to generate, edit, and manage flashcards in a simple and intuitive way, making the spaced repetition learning method more accessible.

## Quick Start

```bash
# Clone and setup
git clone https://github.com/your-username/10xcards.git
cd 10xcards
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start services
supabase start
npm run dev

# Setup test user (first time only)
npx tsx scripts/get-test-token.ts
npx tsx scripts/add-user.ts
```

**→ Open [http://localhost:4321](http://localhost:4321)**

## Table of Contents

- [10xCards](#10xcards)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend \& Database](#backend--database)
    - [AI Integration](#ai-integration)
    - [CI/CD \& Hosting](#cicd--hosting)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Available Scripts](#available-scripts)
  - [Project Scope](#project-scope)
    - [Current Features](#current-features)
    - [Limitations](#limitations)
  - [Project Status](#project-status)
    - [Success Metrics](#success-metrics)
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

- Node.js 22.14.0 (with nvm recommended)
- npm or yarn
- Supabase CLI
- Supabase account (for production)
- Openrouter.ai API key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/10xcards.git
cd 10xcards
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Supabase CLI** (if not already installed)

```bash
npm install -g @supabase/cli
```

4. **Set up environment variables**

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```plaintext
# Local development configuration (default values for local Supabase)
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_KEY="your_local_supabase_anon_key"
SUPABASE_SERVICE_KEY="your_local_supabase_service_key"
OPENROUTER_API_KEY="your_openrouter_api_key"

# Test user credentials (for development)
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="test123456"
TEST_USER_TOKEN=""
```

5. **Start Supabase locally**

```bash
supabase start
```

This will:

- Start local PostgreSQL database
- Run Supabase services (Auth, API, etc.)
- Apply database migrations
- Provide local URLs and keys

6. **Create test user** (first time setup)

```bash
# Generate test user and get token
npx tsx scripts/get-test-token.ts

# Add user to public.users table
npx tsx scripts/add-user.ts
```

7. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

### Local Development Setup

After running `supabase start`, you'll see output similar to:

```
API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
JWT secret: your-jwt-secret
anon key: your-anon-key
service_role key: your-service-role-key
```

Update your `.env` file with these values (especially the keys).

### Testing the API

1. **Get authentication token**:

```bash
npx tsx scripts/get-test-token.ts
```

2. **Test API endpoints**:

```bash
# List flashcard sets
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4321/api/flashcard-sets

# Create a flashcard set
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Set"}' \
  http://localhost:4321/api/flashcard-sets
```

### Supabase Studio

Access the local Supabase Studio at `http://127.0.0.1:54323` to:

- View and edit database tables
- Monitor API requests
- Manage users
- View logs

### Stopping Services

```bash
# Stop Supabase services
supabase stop

# Stop development server
Ctrl+C
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Troubleshooting

### Common Issues

1. **Node.js version mismatch**

   ```bash
   # If using nvm, switch to the correct version
   nvm use 22.14.0
   ```

2. **Supabase CLI not found**

   ```bash
   # Install globally
   npm install -g @supabase/cli

   # Or use npx
   npx supabase start
   ```

3. **Port conflicts**

   - Supabase uses ports 54321-54324
   - Astro dev server uses port 4321
   - Make sure these ports are available

4. **JWT token expired**

   ```bash
   # Generate a new token
   npx tsx scripts/get-test-token.ts
   ```

5. **Database connection issues**

   ```bash
   # Restart Supabase
   supabase stop
   supabase start
   ```

6. **Environment variables not loading**
   - Ensure `.env` file exists in root directory
   - Check file permissions
   - Restart development server after changes

### Getting Help

- Check [Supabase Documentation](https://supabase.com/docs)
- Check [Astro Documentation](https://docs.astro.build/)
- Review project issues on GitHub

## API Documentation

The application provides REST API endpoints for flashcard management:

### Authentication

All API endpoints require authentication via Bearer token:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### Endpoints

#### Flashcard Sets

- `GET /api/flashcard-sets` - List user's flashcard sets
- `POST /api/flashcard-sets` - Create new flashcard set
- `GET /api/flashcard-sets/{id}` - Get specific flashcard set
- `PATCH /api/flashcard-sets/{id}` - Update flashcard set

#### Example Usage

```bash
# Create a flashcard set
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"JavaScript Basics","description":"Learning JS fundamentals"}' \
  http://localhost:4321/api/flashcard-sets

# List flashcard sets with pagination
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:4321/api/flashcard-sets?page=1&limit=10&sort_by=created_at"
```

For detailed API documentation, see `src/lib/openapi/flashcard-sets.yaml`.

## Project Structure

```
10xcards/
├── src/
│   ├── components/          # React and Astro components
│   │   └── ui/             # Shadcn/ui components
│   ├── layouts/            # Astro layouts
│   ├── pages/              # Astro pages and API routes
│   │   └── api/            # REST API endpoints
│   ├── lib/                # Services, utilities, schemas
│   │   ├── services/       # Business logic
│   │   ├── schemas/        # Zod validation schemas
│   │   └── openapi/        # API documentation
│   ├── db/                 # Database types and clients
│   ├── middleware/         # Astro middleware
│   └── types.ts            # Shared TypeScript types
├── scripts/                # Development scripts
├── supabase/               # Database migrations and config
├── docs/                   # Additional documentation
└── .env.example            # Environment variables template
```

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
