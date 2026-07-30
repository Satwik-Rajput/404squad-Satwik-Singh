/**
 * AI Prompt Builder for Market Rate Suggestion in Indian Context
 */
export const buildSuggestRatePrompt = (params: {
  category?: string;
  title?: string;
  description?: string;
  budgetUnit?: string;
}) => {
  const cat = params.category || "Tech & IT";
  const unit = params.budgetUnit || "hour";

  return `You are a freelance market rate expert for India. 
Provide a realistic recommended budget/rate in Indian Rupees (₹ INR) for a job posting on Skill Bridge India.
Job Title: ${params.title || "General Task"}
Category: ${cat}
Unit: ${unit}
Description: ${params.description || "Standard work"}

Respond ONLY with a valid JSON object with the following keys:
{
  "suggestedAmount": number (a realistic numeric value in Indian Rupees, e.g. 1200),
  "unit": "${unit}",
  "reasoning": "A concise 1-2 sentence explanation of why this INR rate is fair for this category/scope.",
  "minRange": number,
  "maxRange": number
}`;
};
