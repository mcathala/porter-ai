# Porter AI

AI-powered business simulation game where player decisions generate dynamic, narrative consequences through a multi-agent pipeline.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **AI/LLM:** LangChain + LangGraph (Groq, Ollama, OpenAI providers)
- **Styling:** Tailwind CSS 4
- **Validation:** Zod
- **Testing:** Vitest

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Then fill in your API keys in .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

### Useful Scripts

```bash
npm run lint       # Lint with ESLint
npm run typecheck  # Type-check with tsc
npm run test       # Run tests with Vitest
```

## Project Structure

```
src/
├── app/              # Next.js pages & API routes
│   ├── api/          # Backend endpoints (initialize, turn, advisor, stakeholder)
│   ├── dashboard/    # Game dashboard (KPIs, stakeholders)
│   ├── briefing/     # Game briefing
│   ├── onboarding/   # Company configuration
│   └── market/       # Market selection
├── components/       # Reusable React components
├── context/          # React context (game state)
└── lib/
    ├── agents/       # AI agent system (LangGraph pipeline)
    ├── types/        # TypeScript type definitions
    └── utils/        # Formatters & logging
```

## Architecture

The AI backend uses a SWOT-based multi-agent pipeline:

```
Player Action → Player Company Agent (SWOT) ─┐
               Market Agent (in parallel)   ─┴→ Gamemaster (synthesis & KPI resolution) → Result
```

The pipeline lives in [src/lib/agents/](src/lib/agents/) — see `graph.ts` for the LangGraph orchestration and `prompts.ts` / `schemas.ts` for agent prompts and output validation.
