/**
 * AI Prompt Builder for Smart Worker Matching
 */
export const buildSmartMatchPrompt = (params: {
  jobTitle: string;
  category: string;
  description: string;
  budget: number;
  budgetUnit: string;
  workers: any[];
}) => {
  return `You are Skill Bridge India's AI Matching Engine.
Given a job request in Indian local context:
- Title: ${params.jobTitle}
- Category: ${params.category}
- Description: ${params.description}
- Budget: ₹${params.budget}/${params.budgetUnit}

Available Workers:
${JSON.stringify(params.workers || [], null, 2)}

Select or analyze up to 3 best worker matches for this job. Return a JSON array of 3 objects with keys:
- workerId: string (must match worker id or index from input list)
- matchPercentage: number (e.g. 96, 91, 88)
- reason: string (1 concise sentence explaining why they are a strong match for this specific task)
- highlightSkill: string (e.g. "Top Rated Expert", "Quick Availability", "100+ Completed Tasks")`;
};
