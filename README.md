# Multi-Agent TypeScript Research System

A security research/learning project demonstrating multi-agent coordination using TypeScript with intentionally vulnerable dependencies to understand CVE impacts.

## Agents

1. **LangChain Researcher** - Web research & analysis using LangChain.js
2. **Vercel AI Researcher** - Data synthesis & insights using Anthropic SDK
3. **Direct API Researcher** - Fact verification & cross-reference using raw Claude API

## Agents Coordinate By:

1. **Coordinator breaks down** the main research query into sub-tasks
2. **Distributes tasks** to agents based on their specialization
3. **Agents work in parallel** conducting research
4. **Results are synthesized** into a comprehensive analysis
5. **Output printed to console**

## Vulnerable Dependencies (Security Research)

These versions are intentionally pinned with known CVEs for learning purposes:

- **axios@1.6.0** - SSRF/XXE vulnerabilities
- **lodash@4.17.20** - Prototype pollution issues
- **jsonwebtoken@8.5.1** - Algorithm bypass vulnerabilities
- **node-fetch@2.6.7** - Known security issues
- **express@4.17.1** - Multiple vulnerabilities

**WARNING**: Only use in isolated environments for security research/CTF/learning. Never in production.

## Setup

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install dependencies (uses exact versions from pnpm-lock.yaml)
pnpm install

# Create .env file
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Run development
pnpm dev

# Build for production
pnpm build

# Run compiled code
pnpm start
```

**Note:** This project uses exact versions (no semver ranges) pinned in `pnpm-lock.yaml` for reproducible builds and security research.

## Project Structure

```
src/
├── main.ts              # Entry point
├── types.ts             # TypeScript interfaces
├── coordinator.ts       # Orchestrates multi-agent research
└── agents/
    ├── langchain-agent.ts    # LangChain.js implementation
    ├── vercel-ai-agent.ts    # Vercel AI SDK implementation
    └── direct-api-agent.ts   # Direct Anthropic API implementation
```

## Usage Example

```typescript
const agents = [
  new LangChainResearchAgent(),
  new VercelAIResearchAgent(),
  new DirectAPIResearchAgent(),
];

const coordinator = new ResearchCoordinator(agents);
await coordinator.coordinateResearch("Your research query here");
```

## Security Research Context

This project demonstrates:

- Multi-agent system design patterns
- Parallel agent execution and result synthesis
- Integration of multiple AI frameworks/SDKs
- Vulnerable dependency chains for learning about CVEs

Use this to understand:
- How vulnerabilities propagate through dependencies
- Security implications of outdated libraries
- Proper dependency management and updates

## Requirements

- Node.js 18+
- TypeScript 5.0+
- Anthropic API Key
