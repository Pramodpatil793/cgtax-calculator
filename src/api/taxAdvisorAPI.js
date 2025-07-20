import { TaxCalculationResult } from "../models/TaxCalculationResult";

// The trigger URL for a V1 function is different. It includes the function name.
const V1_FUNCTION_URL = "https://us-central1-cgtax-web-app.cloudfunctions.net/getAiTaxAdvice";

export const fetchAiTaxAdvice = async (results) => {
    if (!results || !(results instanceof TaxCalculationResult)) {
        throw new Error("Invalid results object provided to AI Advisor.");
    }
    
    // This check for a local key is no longer needed, so it can be removed.

    // The prompt generation logic is completely unchanged.
    const prompt = `You are an expert Indian tax advisor for FY 2024-25. You have two tasks.

TASK 1: EXPLAIN THE CALCULATION
Strictly use only the following data to explain the tax calculation. Do not mention any other rates, sections, or rules from your own knowledge. Base your explanation exclusively on this data:
 - Asset: ${results.assetType}
 - Net Gain/Loss: ₹${results.formattedNetGainOrLoss} (${results.netGain > 0 ? 'Gain' : 'Loss'})
 - Classification: ${results.isLongTerm ? 'Long-Term' : 'Short-Term'}
 - Applicable Tax Rate: ${results.displayTaxRate}
 - Exemption Applied: ₹${results.formattedExemption}
 - Relevant Law: ${results.relevantLaw || 'as per standard income tax rules'}

TASK 2: SUGGEST STRATEGIES
Now, acting as a general tax expert for FY 2024-25, suggest relevant and actionable tax-saving strategies for the given asset and gain/loss scenario. Here you can use your broader knowledge of the Indian Income Tax Act. If it's a loss, suggest how to use it. If no strategies apply, state that clearly.

**Output Format:**
Provide a valid JSON object with two keys: "breakdown" and "strategies".
 - "breakdown": A concise paragraph for Task 1.
 - "strategies": An array of strings for Task 2.
`;

try {
    // Use a standard fetch call, which is what V1 functions expect.
    const response = await fetch(V1_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
        throw new Error(`API error ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        let text = result.candidates[0].content.parts[0].text;
        text = text.replace(/```json\n?|```/g, '');
        return JSON.parse(text);
    } else {
        throw new Error("Invalid AI response structure");
    }
} catch (error) {
    console.error("AI Advisor Error:", error);
    throw error;
}
};