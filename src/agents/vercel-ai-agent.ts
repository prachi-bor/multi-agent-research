import { Agent } from "../types.js";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export class VercelAIResearchAgent implements Agent {
  name = "Vercel AI Researcher";
  role = "Data Synthesis & Insights";

  async research(query: string): Promise<string> {
    console.log(`\n[${this.name}] Starting research on: "${query}"`);

    try {
      const systemPrompt = `You are a research specialist that synthesizes information.
Your role is to analyze research queries and provide structured insights.
Focus on: key findings, patterns, and actionable insights.`;

      const result = await generateText({
        model: anthropic("claude-3-5-sonnet-20241022"),
        system: systemPrompt,
        prompt: `Research this topic and provide key insights: ${query}`,
      });

      console.log(`[${this.name}] Research completed`);
      return result.text;
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return "Error conducting research";
    }
  }
}
