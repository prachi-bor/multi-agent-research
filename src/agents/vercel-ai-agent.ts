import { Agent } from "../types.js";
import { Anthropic } from "@anthropic-ai/sdk";

export class VercelAIResearchAgent implements Agent {
  name = "Vercel AI Researcher";
  role = "Data Synthesis & Insights";
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  private getTools(): any[] {
    return [
      {
        name: "web_search",
        description: "Search the web for information about a topic",
        input_schema: {
          type: "object" as const,
          properties: {
            query: {
              type: "string",
              description: "The search query",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "analyze_data",
        description: "Analyze and synthesize data into key insights",
        input_schema: {
          type: "object" as const,
          properties: {
            data: {
              type: "string",
              description: "The data to analyze",
            },
          },
          required: ["data"],
        },
      },
    ];
  }

  private async executeWebSearch(query: string): Promise<string> {
    console.log(`  [${this.name}] Searching web for: "${query}"`);
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
      const response = await fetch(url);
      const data = await response.json();
      return JSON.stringify((data as any).RelatedTopics?.slice(0, 3) || []);
    } catch (error) {
      return "Web search unavailable";
    }
  }

  private analyzeData(data: string): string {
    console.log(`  [${this.name}] Analyzing data...`);
    return `Analysis of ${data.substring(0, 100)}...`;
  }

  async research(query: string): Promise<string> {
    console.log(`\n[${this.name}] Starting research on: "${query}"`);

    try {
      const systemPrompt = `You are a research specialist that synthesizes information.
Your role is to analyze research queries and provide structured insights.
Focus on: key findings, patterns, and actionable insights.
Use available tools to search for information and analyze it.`;

      const tools = this.getTools();
      const messages: Anthropic.Messages.MessageParam[] = [
        {
          role: "user",
          content: `Research this topic and provide key insights: ${query}`,
        },
      ];

      // Multi-turn agentic loop
      let response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        tools,
        messages,
      });

      // Handle tool use in agentic loop
      while (response.stop_reason === "tool_use") {
        const toolUseBlock = response.content.find(
          (block: any) => block.type === "tool_use"
        );

        if (!toolUseBlock) break;

        console.log(`  [${this.name}] Using tool: ${toolUseBlock.name}`);

        let toolResult: string;
        if (toolUseBlock.name === "web_search") {
          const input = toolUseBlock.input as { query: string };
          toolResult = await this.executeWebSearch(input.query);
        } else if (toolUseBlock.name === "analyze_data") {
          const input = toolUseBlock.input as { data: string };
          toolResult = this.analyzeData(input.data);
        } else {
          toolResult = "Unknown tool";
        }

        // Add assistant response and tool result to messages
        messages.push({
          role: "assistant",
          content: response.content,
        });

        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUseBlock.id,
              content: toolResult,
            },
          ],
        });

        // Continue the conversation
        response = await this.client.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          system: systemPrompt,
          tools,
          messages,
        });
      }

      // Extract final text response
      const textBlock = response.content.find(
        (block: any) => block.type === "text"
      );
      const result = textBlock?.text || "No response generated";

      console.log(`[${this.name}] Research completed`);
      return result;
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return "Error conducting research";
    }
  }
}
