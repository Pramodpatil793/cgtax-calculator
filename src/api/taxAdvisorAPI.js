import { TaxCalculationResult } from "../models/TaxCalculationResult";

// --- CHANGE 1: REMOVED THE INSECURE API KEY CONSTANT ---
// const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// --- CHANGE 2: ADDED THE SECURE CLOUD FUNCTION URL ---
// Make sure this URL is the one you copied after deploying your function
const SECURE_FUNCTION_URL = "https://getaitaxadvice-byyaiqmaha-uc.a.run.app";

export const fetchAiTaxAdvice = async (results) => {
  if (!results || !(results instanceof TaxCalculationResult)) {
    throw new Error("Invalid results object provided to AI Advisor.");
  }

  // The prompt generation logic remains completely unchanged.
  const prompt = `You are an expert Indian tax advisor for FY 2024-25. You have two tasks.

TASK 1: EXPLAIN THE CALCULATION
Strictly use only the following data to explain the tax calculation. Do not mention any other rates, sections, or rules from your own knowledge. Base your explanation exclusively on this data:
 - Asset: ${results.assetType}
 - Net Gain/Loss: ₹${results.formattedNetGainOrLoss} (${results.netGain > 0 ? "Gain" : "Loss"})
 - Classification: ${results.isLongTerm ? "Long-Term" : "Short-Term"}
 - Applicable Tax Rate: ${results.displayTaxRate}
 - Exemption Applied: ₹${results.formattedExemption}
 - Relevant Law: ${results.relevantLaw || "as per standard income tax rules"}

TASK 2: SUGGEST STRATEGIES
Now, acting as a general tax expert for FY 2024-25, suggest relevant and actionable tax-saving strategies for the given asset and gain/loss scenario. Here you can use your broader knowledge of the Indian Income Tax Act. If it's a loss, suggest how to use it. If no strategies apply, state that clearly.

**Output Format:**
Provide a valid JSON object with two keys: "breakdown" and "strategies".
 - "breakdown": A concise paragraph for Task 1.
 - "strategies": An array of strings for Task 2.
`;

  try {
    // --- CHANGE 4: UPDATED THE API URL AND FETCH BODY ---
    // The apiUrl now points to your secure function
    const apiUrl = SECURE_FUNCTION_URL; 
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The body now sends the generated prompt to your cloud function
      body: JSON.stringify({ prompt: prompt }), 
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${await response.text()}`);
    }

    // The rest of the response handling logic remains unchanged.
    const result = await response.json();
    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      let text = result.candidates[0].content.parts[0].text;
      // Clean the response text to ensure it's valid JSON
      text = text.replace(/```json\n?|```/g, "");
      return JSON.parse(text);
    } else {
      throw new Error("Invalid AI response structure");
    }
  } catch (error) {
    console.error("AI Advisor Error:", error);
    throw error; // Re-throw the error to be caught by the calling hook
  }
};