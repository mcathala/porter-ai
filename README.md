# Porter AI

AI-powered business simulation game where player decisions generate dynamic, narrative consequences through a multi-agent pipeline.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **AI/LLM:** LangChain + LangGraph (Groq, Ollama, OpenAI providers)
- **Styling:** Tailwind CSS 4
- **Validation:** Zod

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

## Project Structure

```
src/
├── app/              # Next.js pages & API routes
│   ├── api/          # Backend endpoints (initialize, turn, advisor)
│   ├── dashboard/    # Game dashboard (KPIs, stakeholders)
│   ├── briefing/     # Game briefing/onboarding
│   ├── company/      # Company configuration
│   └── market/       # Market selection
├── components/       # Reusable React components
├── context/          # React context (game state)
└── lib/
    ├── agents/       # AI agent system (LangGraph pipeline)
    └── types/        # TypeScript type definitions
```

## Architecture

The AI backend uses a SWOT-based multi-agent pipeline:

```
Player Action → SWOT Analysis → Internal Agent + External Agent → Narrative Synthesis → KPI Resolution
```

See [agent-system-refacto.md](agent-system-refacto.md) for the full architecture document.
