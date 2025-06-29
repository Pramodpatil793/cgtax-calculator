import { useState, useCallback } from 'react';
import { fetchAiTaxAdvice } from '../api/taxAdvisorAPI';

export const useAiAdvisor = () => {
    const [aiInsight, setAiInsight] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    const getAiAdvice = useCallback(async (results) => {
        if (!results) return;

        setIsAiLoading(true);
        setAiInsight(null);
        setAiError(null);

        try {
            const insight = await fetchAiTaxAdvice(results);
            setAiInsight(insight);
        } catch (error) {
            console.error("Failed to get AI advice:", error);
            setAiError("Sorry, an error occurred while connecting to the AI Tax Advisor.");
        } finally {
            setIsAiLoading(false);
        }
    }, []);

    const clearAiInsight = useCallback(() => {
        setAiInsight(null);
        setAiError(null);
    }, []);

    return { aiInsight, isAiLoading, aiError, getAiAdvice, clearAiInsight };
};