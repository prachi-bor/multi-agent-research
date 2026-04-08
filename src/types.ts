export interface Agent {
  name: string;
  role: string;
  research(query: string): Promise<string>;
}

export interface ResearchTask {
  id: string;
  query: string;
  assignedTo?: string;
}

export interface ResearchResult {
  agentName: string;
  query: string;
  result: string;
  timestamp: Date;
}
