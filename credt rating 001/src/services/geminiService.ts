
import { GoogleGenAI } from "@google/genai";
import { FinancialData, RatingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getRatingInsights(data: FinancialData, result: RatingResult, targetRating: string) {
  const prompt = `
    As a senior credit analyst for an Indian rating agency (like CRISIL or ICRA), analyze the following corporate financial data and provide a gap analysis.
    
    Company: ${data.companyName}
    Industry: ${data.industry}
    Current Estimated Rating: ${result.estimatedRating}
    Target Rating: ${targetRating}
    
    Key Ratios:
    - Debt/EBITDA: ${result.ratios.debtToEbitda.toFixed(2)} (Benchmark Good: ${result.benchmarks.debtToEbitda.good})
    - Interest Coverage: ${result.ratios.interestCoverage.toFixed(2)} (Benchmark Good: ${result.benchmarks.interestCoverage.good})
    - Debt/Equity: ${result.ratios.debtToEquity.toFixed(2)} (Benchmark Good: ${result.benchmarks.debtToEquity.good})
    - EBITDA Margin: ${(result.ratios.ebitdaMargin * 100).toFixed(2)}% (Benchmark Good: ${(result.benchmarks.ebitdaMargin * 100).toFixed(2)}%)
    
    Please provide:
    1. A summary of the credit profile.
    2. Specific "Gaps" identified between the current state and the target rating.
    3. Actionable recommendations to bridge these gaps (e.g., debt restructuring, working capital management, operational efficiency).
    4. Potential risks to the rating.
    
    Format the response in clean Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingLevel: "HIGH" }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error getting AI insights:", error);
    return "Failed to generate AI insights. Please check your financial data and try again.";
  }
}
