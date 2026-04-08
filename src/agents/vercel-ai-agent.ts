import { Agent } from "../types.js";
import { Anthropic } from "@anthropic-ai/sdk";

export class VercelAIResearchAgent implements Agent {
  name = "Vercel AI Researcher";
  role = "Data Synthesis & Insights";
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  async research(query: string): Promise<string> {
    console.log(`\n[${this.name}] Starting research on: "${query}"`);

    try {
      const systemPrompt = `You are a research specialist that synthesizes information.
Your role is to analyze research queries and provide structured insights.
Focus on: key findings, patterns, and actionable insights.`;

      const message = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Research this topic and provide key insights: ${query}`,
          },
        ],
      });

      const result =
        message.content[0].type === "text" ? message.content[0].text : "";

      console.log(`[${this.name}] Research completed`);
      return result;
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return "Error conducting research";
    }
  }
}
