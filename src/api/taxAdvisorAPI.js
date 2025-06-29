import { GEMINI_API_KEY } from '../constants/appConfig';
import { TaxCalculationResult } from '../models/TaxCalculationResult';

export const fetchAiTaxAdvice = async (results) => {
    if (!results || !(results instanceof TaxCalculationResult)) {
        throw new Error("Invalid results object provided to AI Advisor.");
    }
    
    // Ensure you have set your API key in src/constants/appConfig.js
    if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE" || !GEMINI_API_KEY) {
         console.error("Gemini API Key is missing.");
         return {
            breakdown: "AI Advisor is not configured. Please add your API key in `src/constants/appConfig.js` to enable this feature.",
            strategies: ["Configuration required."]
        };
    }

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
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            throw new Error(`API error ${response.status}: ${await response.text()}`);
        }

        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            let text = result.candidates[0].content.parts[0].text;
            // Clean the response text to ensure it's valid JSON
            text = text.replace(/```json\n?|```/g, '');
            return JSON.parse(text);
        } else {
            throw new Error("Invalid AI response structure");
        }
    } catch (error) {
        console.error("AI Advisor Error:", error);
        throw error; // Re-throw the error to be caught by the calling hook
    }
};