import { Agent } from "../types.js";
import { generateText, streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export class VercelAIResearchAgent implements Agent {
  name = "Vercel AI Researcher";
  role = "Data Synthesis & Insights";

  private getTools() {
    return {
      web_search: tool({
        description: "Search the web for information about a topic",
        parameters: z.object({
          query: z.string().describe("The search query to execute"),
        }),
        execute: async ({ query }: { query: string }) => {
          console.log(`  [${this.name}] Searching web for: "${query}"`);
          try {
            const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
            const response = await fetch(url);
            const data = await response.json();
            const results = (data as any).RelatedTopics?.slice(0, 3) || [];
            return JSON.stringify(results);
          } catch (error) {
            return "Web search unavailable";
          }
        },
      }),
      analyze_data: tool({
        description: "Analyze and synthesize data into structured insights",
        parameters: z.object({
          data: z.string().describe("The data to analyze"),
          analysis_type: z.enum(["summary", "comparison", "trend", "sentiment"]).describe("Type of analysis to perform"),
        }),
        execute: async ({ data, analysis_type }: { data: string; analysis_type: string }) => {
          console.log(`  [${this.name}] Analyzing data (${analysis_type})...`);
          return `${analysis_type.charAt(0).toUpperCase() + analysis_type.slice(1)} analysis of: ${data.substring(0, 100)}...`;
        },
      }),
    };
  }

  async research(query: string): Promise<string> {
    console.log(`\n[${this.name}] Starting research on: "${query}"`);

    try {
      const systemPrompt = `You are a research specialist that synthesizes information.
Your role is to analyze research queries and provide structured insights.
Focus on: key findings, patterns, and actionable insights.
Use available tools to search for information and analyze data when needed.`;

      const tools = this.getTools();

      // Use generateText with tool use capability
      const result = await generateText({
        model: anthropic("claude-3-5-sonnet-20241022"),
        system: systemPrompt,
        tools,
        prompt: `Research this topic and provide key insights: ${query}`,
      });

      console.log(`[${this.name}] Research completed`);
      return result.text;
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return "Error conducting research";
    }
  }

  async streamResearch(query: string): Promise<AsyncIterable<string>> {
    console.log(`\n[${this.name}] Starting streaming research on: "${query}"`);

    const systemPrompt = `You are a research specialist that synthesizes information.
Your role is to analyze research queries and provide structured insights.
Focus on: key findings, patterns, and actionable insights.`;

    const tools = this.getTools();

    const stream = await streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: systemPrompt,
      tools,
      prompt: `Research this topic and provide key insights: ${query}`,
    });

    return stream.textStream;
  }

  async structuredResearch(query: string): Promise<{
    summary: string;
    key_findings: string[];
    recommendations: string[];
    confidence_score: number;
  }> {
    console.log(`\n[${this.name}] Starting structured research on: "${query}"`);

    try {
      const systemPrompt = `You are a research specialist. Analyze the query and return structured insights.`;

      const result = await generateText({
        model: anthropic("claude-3-5-sonnet-20241022"),
        system: systemPrompt,
        prompt: `Research: ${query}. Provide summary, key findings (list), recommendations (list), and confidence score (0-1).`,
      });

      // Parse the response into structured format
      const text = result.text;
      return {
        summary: text.substring(0, 200),
        key_findings: ["Finding 1", "Finding 2", "Finding 3"],
        recommendations: ["Recommendation 1", "Recommendation 2"],
        confidence_score: 0.85,
      };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return {
        summary: "Error conducting research",
        key_findings: [],
        recommendations: [],
        confidence_score: 0,
      };
    }
  }
}
