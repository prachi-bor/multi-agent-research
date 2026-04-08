import { Agent } from "../types.js";
import { ChatAnthropic } from "@langchain/anthropic";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { Tool } from "@langchain/core/tools";
import { DynamicTool } from "langchain/tools";
import fetch from "node-fetch";

export class LangChainResearchAgent implements Agent {
  name = "LangChain Researcher";
  role = "Web Research & Analysis";
  private llm: ChatAnthropic;
  private executor: AgentExecutor | null = null;

  constructor() {
    this.llm = new ChatAnthropic({
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
    });
  }

  private getTools(): Tool[] {
    return [
      new DynamicTool({
        name: "web_search",
        description: "Search the web for information",
        func: async (query: string) => {
          console.log(`  [LangChain] Searching web for: "${query}"`);
          try {
            const response = await fetch(
              `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
              { timeout: 5000 }
            );
            const data = await response.json();
            return JSON.stringify((data as any).RelatedTopics?.slice(0, 3) || []);
          } catch (error) {
            return "Web search unavailable (for security research purposes)";
          }
        },
      }),
      new DynamicTool({
        name: "analyze_content",
        description: "Analyze and summarize content",
        func: async (content: string) => {
          console.log(`  [LangChain] Analyzing content...`);
          return `Analyzed: ${content.substring(0, 100)}...`;
        },
      }),
    ];
  }

  async research(query: string): Promise<string> {
    console.log(`\n[${this.name}] Starting research on: "${query}"`);

    const tools = this.getTools();
    const prompt =
      "You are a helpful research assistant. Answer the following query: " +
      query;

    try {
      const response = await this.llm.invoke([
        { role: "user", content: prompt },
      ]);
      const result =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);

      console.log(`[${this.name}] Research completed`);
      return result;
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return "Error conducting research";
    }
  }
}
