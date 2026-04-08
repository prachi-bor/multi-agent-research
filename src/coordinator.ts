import { Agent, ResearchTask, ResearchResult } from "./types.js";
import { Anthropic } from "@anthropic-ai/sdk";

export class ResearchCoordinator {
  private agents: Agent[];
  private client: Anthropic;
  private results: ResearchResult[] = [];

  constructor(agents: Agent[]) {
    this.agents = agents;
    this.client = new Anthropic();
  }

  async coordinateResearch(mainQuery: string): Promise<void> {
    console.log("\n" + "=".repeat(70));
    console.log("MULTI-AGENT RESEARCH COORDINATOR");
    console.log("=".repeat(70));
    console.log(`Main Query: ${mainQuery}\n`);

    // Step 1: Break down the main query into sub-tasks
    const subTasks = await this.breakdownQuery(mainQuery);
    console.log("\n[Coordinator] Query broken into sub-tasks:");
    subTasks.forEach((task, i) => {
      console.log(`  ${i + 1}. ${task}`);
    });

    // Step 2: Distribute tasks to agents
    const agentTasks = this.distributeTasks(subTasks);

    // Step 3: Agents conduct parallel research
    console.log("\n[Coordinator] Agents conducting parallel research...");
    const researchPromises = agentTasks.map(async (task, idx) => {
      const result = await this.agents[idx].research(task);
      return {
        agentName: this.agents[idx].name,
        query: task,
        result,
        timestamp: new Date(),
      };
    });

    this.results = await Promise.all(researchPromises);

    // Step 4: Synthesize results
    console.log("\n[Coordinator] Synthesizing results...");
    await this.synthesizeResults(mainQuery);
  }

  private async breakdownQuery(query: string): Promise<string[]> {
    try {
      const message = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system:
          "Break down a research query into 2-3 specific sub-questions that different specialists could research. Return as a JSON array of strings.",
        messages: [
          {
            role: "user",
            content: `Break down this research query: "${query}"`,
          },
        ],
      });

      const content =
        message.content[0].type === "text" ? message.content[0].text : "[]";
      try {
        return JSON.parse(content);
      } catch {
        return [query, query + " (alternative perspective)"];
      }
    } catch (error) {
      console.error("Error breaking down query:", error);
      return [query];
    }
  }

  private distributeTasks(tasks: string[]): string[] {
    const distributed: string[] = [];
    for (let i = 0; i < this.agents.length; i++) {
      distributed.push(tasks[i % tasks.length]);
    }
    return distributed;
  }

  private async synthesizeResults(mainQuery: string): Promise<void> {
    const resultsText = this.results
      .map(
        (r) =>
          `[${r.agentName}]\n${r.result}\n---`
      )
      .join("\n");

    try {
      const message = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        system: `You are a research synthesis specialist. Combine findings from multiple research agents into a cohesive analysis.
Highlight agreements, disagreements, and unique insights from each agent.`,
        messages: [
          {
            role: "user",
            content: `Synthesize these research findings on "${mainQuery}":\n\n${resultsText}`,
          },
        ],
      });

      const synthesis =
        message.content[0].type === "text" ? message.content[0].text : "";

      console.log("\n" + "=".repeat(70));
      console.log("FINAL SYNTHESIS");
      console.log("=".repeat(70));
      console.log(synthesis);
      console.log("\n" + "=".repeat(70));
    } catch (error) {
      console.error("Error synthesizing results:", error);
    }
  }

  displayResults(): void {
    console.log("\n" + "=".repeat(70));
    console.log("DETAILED RESULTS");
    console.log("=".repeat(70));
    this.results.forEach((result) => {
      console.log(`\n[${result.agentName}] - Query: ${result.query}`);
      console.log(result.result);
      console.log("-".repeat(70));
    });
  }
}
