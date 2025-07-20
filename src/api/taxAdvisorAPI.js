import { TaxCalculationResult } from "../models/TaxCalculationResult";
// --- CHANGE 1: IMPORT THE NECESSARY FIREBASE MODULES ---
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

// --- CHANGE 2: ADD YOUR FIREBASE CONFIGURATION OBJECT ---
// You can find this in your Firebase Project Settings -> General -> Your apps -> SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfHA-qDvvJEs9fhvJK7p79_p6FibDlmsk",
    authDomain: "cgtax-web-app.firebaseapp.com",
    projectId: "cgtax-web-app",
    storageBucket: "cgtax-web-app.appspot.com",
    messagingSenderId: "248508033985",
    appId: "1:248508033985:web:dda09e42c187169b8d2349",
    measurementId: "G-PVHB3V93TW",
  };
  

// --- CHANGE 3: INITIALIZE FIREBASE AND GET A REFERENCE TO THE FUNCTION ---
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const getAiTaxAdviceCallable = httpsCallable(functions, "getAiTaxAdvice");


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
        // --- CHANGE 4: CALL THE FUNCTION USING THE NEW V2 METHOD ---
        const result = await getAiTaxAdviceCallable({ prompt: prompt });

        // The actual response from the AI is now inside a `data` property
        const responseData = result.data; 

        // The rest of the response handling logic is unchanged.
        if (responseData.candidates?.[0]?.content?.parts?.[0]?.text) {
            let text = responseData.candidates[0].content.parts[0].text;
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