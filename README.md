# n7n - AI Workflow Automation Platform

An AI-powered workflow automation platform built with Next.js, enabling users to create visual workflows that connect various services and AI models. Similar to n8n, but with a focus on AI integration.

## Features

-  **Visual Workflow Editor** - Drag-and-drop interface powered by React Flow
- **AI Integration** - Support for OpenAI, Anthropic (Claude), and Google Gemini
-  **Multiple Integrations**:
  - **Triggers**: Manual, Google Forms, Stripe webhooks
  - **Actions**: HTTP Request, Discord, Slack
-  **Secure Credential Management** - Encrypted storage for API keys and credentials
- **Execution Tracking** - Monitor workflow executions with real-time status updates
- **Background Processing** - Powered by Inngest for reliable workflow execution
- **User Authentication** - Secure authentication with Better Auth

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, Radix UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **API**: tRPC
- **State Management**: Jotai, TanStack Query
- **Workflow Engine**: Inngest
- **Visual Editor**: React Flow (@xyflow/react)
- **Code Quality**: Biome (linting & formatting)

## Prerequisites

- Node.js 20+ 
- PostgreSQL database
- npm, yarn, pnpm, or bun

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kiralightyagami/n7n.git
cd n7n
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Run Inngest Dev Server (for workflow execution)

In a separate terminal, run:

```bash
npm run inngest:dev
```

## Available Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run inngest:dev` - Start Inngest development server

## Project Structure

```
n7n/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── (auth)/     # Authentication pages
│   │   ├── (dashboard)/ # Dashboard pages
│   │   └── api/        # API routes
│   ├── components/     # React components
│   │   ├── ui/         # UI component library
│   │   └── react-flow/ # Workflow editor components
│   ├── features/       # Feature modules
│   │   ├── auth/       # Authentication
│   │   ├── credentials/# Credential management
│   │   ├── editor/     # Workflow editor
│   │   ├── executions/ # Workflow execution
│   │   ├── triggers/   # Trigger components
│   │   └── workflows/  # Workflow management
│   ├── ingest/         # Inngest functions and channels
│   ├── lib/            # Utility libraries
│   └── trpc/           # tRPC routers and setup
└── README.md
```

## Key Features Explained

### Workflows

Create visual workflows by connecting nodes. Each workflow consists of:
- **Nodes**: Individual steps in your workflow (triggers, actions, AI models)
- **Connections**: Links between nodes that define data flow
- **Credentials**: Secure API keys stored encrypted in the database

### Supported Node Types

**Triggers:**
- Manual Trigger - Manually start workflows
- Google Form Trigger - Trigger on form submissions
- Stripe Trigger - Trigger on Stripe webhook events

**Actions:**
- HTTP Request - Make HTTP requests
- OpenAI - Use OpenAI models
- Anthropic - Use Claude models
- Gemini - Use Google Gemini models
- Discord - Send messages to Discord
- Slack - Send messages to Slack

### Executions

Every workflow run creates an execution record that tracks:
- Execution status (Running, Success, Failed)
- Start and completion times
- Error messages and stack traces
- Output data

## Database

This project uses Prisma with PostgreSQL. Key models include:
- `User` - User accounts
- `Workflow` - Workflow definitions
- `Node` - Individual workflow nodes
- `Connection` - Links between nodes
- `Credential` - Encrypted API credentials
- `Execution` - Workflow execution records

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Inngest Documentation](https://www.inngest.com/docs)
- [React Flow Documentation](https://reactflow.dev)
- [tRPC Documentation](https://trpc.io)

## License

[Add your license here]
