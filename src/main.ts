import "dotenv/config";
import { LangChainResearchAgent } from "./agents/langchain-agent.js";
import { VercelAIResearchAgent } from "./agents/vercel-ai-agent.js";
import { DirectAPIResearchAgent } from "./agents/direct-api-agent.js";
import { ResearchCoordinator } from "./coordinator.js";

async function main() {
  // Initialize agents
  const agents = [
    new LangChainResearchAgent(),
    new VercelAIResearchAgent(),
    new DirectAPIResearchAgent(),
  ];

  // Display agent info
  console.log("Initialized Agents:");
  agents.forEach((agent) => {
    console.log(`  - ${agent.name}: ${agent.role}`);
  });

  // Create coordinator
  const coordinator = new ResearchCoordinator(agents);

  // Run research on a topic
  try {
    await coordinator.coordinateResearch(
      "What are the latest advancements in AI security and how do they address vulnerabilities?"
    );
    coordinator.displayResults();
  } catch (error) {
    console.error("Research coordination failed:", error);
    process.exit(1);
  }
}

main();
