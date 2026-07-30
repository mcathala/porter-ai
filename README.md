# Porter AI

AI-powered business simulation game where player decisions generate dynamic, narrative consequences through a multi-agent pipeline.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **AI/LLM:** LangChain + LangGraph (Groq or Ollama providers)
- **Styling:** Tailwind CSS 4
- **Validation:** Zod
- **Testing:** Vitest

## Getting Started

Requires Node.js 20.9+ (Next.js 16) and a [Groq API key](https://console.groq.com/) (or a local Ollama instance).

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

### Environment Variables

| Variable | Description |
| --- | --- |
| `LLM_PROVIDER` | `groq` (default) or `ollama` |
| `GROQ_API_KEY` | Groq API key — get one at [console.groq.com](https://console.groq.com/) |
| `GROQ_MODEL` | Groq model name (default: `openai/gpt-oss-20b`) |
| `OLLAMA_MODEL` | Ollama model name (default: `gpt-oss:120b-cloud`) |
| `OLLAMA_BASE_URL` | Ollama endpoint (default: `https://ollama.com`; use `http://localhost:11434` for local) |
| `OLLAMA_API_KEY` | Only needed for hosted Ollama instances requiring auth |

### Useful Scripts

```bash
npm run lint       # Lint with ESLint
npm run typecheck  # Type-check with tsc
npm run test       # Run tests with Vitest
npm run build      # Production build
npm start          # Serve the production build
```

### Playtesting

With the dev server running, two Python scripts can play full games against the API for diagnostics (KPI tracking, dampening analysis, market share validation). They only need Python 3 — no packages to install:

```bash
python3 scripts/playtest.py     # Scripted playthrough (see --preset, --difficulty, --market)
python3 scripts/playtest-ai.py  # Adaptive AI player that decides its own moves each turn
```

## Project Structure

```
scripts/              # Automated playtest scripts (Python)
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

The pipeline lives in [src/lib/agents/](src/lib/agents/) — see `graph.ts` for the LangGraph orchestration and `prompts.ts` / `schemas.ts` for agent prompts and output validation. Provider selection (Groq/Ollama) is centralized in `llm.ts`.

## API Endpoints

All endpoints are `POST` with JSON bodies:

| Endpoint | Description |
| --- | --- |
| `/api/initialize` | Set up a new game (market, competitors, starting KPIs) |
| `/api/turn` | Resolve a turn through the multi-agent pipeline |
| `/api/advisor/chat` | Chat with the AI advisor (streams the reply) |
| `/api/stakeholder/chat` | Chat with a stakeholder contact (streams the reply) |
