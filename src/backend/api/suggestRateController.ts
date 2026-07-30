import { getGenAIClient } from "../../ai-development/geminiClient";
import { buildSuggestRatePrompt } from "../../ai-development/ratePrompts";

export const handleSuggestRate = async (req: any, res: any) => {
  const { category, title, description, budgetUnit } = req.body;
  const cat = category || "Tech & IT";
  const unit = budgetUnit || "hour";

  const fallbackRates: Record<string, number> = {
    "Home Services": 600,
    "Legal Advice": 2200,
    Legal: 2200,
    Education: 850,
    "Tech & IT": 1500,
    Tech: 1500,
    Creative: 1200,
    Wellness: 1000,
  };
  const base = fallbackRates[cat] || 1000;

  try {
    const ai = getGenAIClient();
    const prompt = buildSuggestRatePrompt({ category, title, description, budgetUnit });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.log("[Smart Rate] Using market fallback rate for:", cat);
    return res.json({
      suggestedAmount: base,
      unit: unit,
      reasoning: `Based on current Indian market standards for ${cat}, typical rates range between ₹${Math.round(
        base * 0.8
      ).toLocaleString()} and ₹${Math.round(base * 1.3).toLocaleString()} per ${unit}.`,
      minRange: Math.round(base * 0.8),
      maxRange: Math.round(base * 1.3),
    });
  }
};
