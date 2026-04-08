import { Agent } from "../types.js";
import { Anthropic } from "@anthropic-ai/sdk";

export class DirectAPIResearchAgent implements Agent {
  name = "Direct API Researcher";
  role = "Fact Verification & Cross-Reference";
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  async research(query: string): Promise<string> {
    console.log(`\n[${this.name}] Starting research on: "${query}"`);

    try {
      const systemPrompt = `You are a fact-checking and verification specialist.
Your role is to verify information and identify potential inaccuracies.
Focus on: credibility, sources, and contradictions.`;

      const message = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Verify and cross-reference this research topic: ${query}. Focus on credibility and potential issues.`,
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
