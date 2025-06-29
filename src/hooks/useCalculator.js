import { useState, useCallback, useEffect } from 'react';
import { useFormManager } from './useFormManager';
import { useAiAdvisor } from './useAiAdvisor';
import { ASSET_CONFIGS } from '../config/assetConfig';
import { calculateTax } from '../utils/taxCalculations';

// This is the final, correct version that obeys the Rules of Hooks.
export const useCalculator = (selectedAssetId) => {
    // --- All hooks are now called at the top level, unconditionally. ---
    
    // We get the config, but it can be null if no asset is selected.
    const assetConfig = selectedAssetId ? ASSET_CONFIGS[selectedAssetId] : null;

    const { formData, setFormData, formErrors, setFormErrors, handleInputChange, resetForm: baseResetForm } = useFormManager(assetConfig?.initialState);
    const { aiInsight, isAiLoading, aiError, getAiAdvice, clearAiInsight } = useAiAdvisor();
    const [results, setResults] = useState(null);

    // --- Logic is now handled conditionally WITHIN effects and callbacks. ---

    // Effect to reset the form when the selected asset changes.
    useEffect(() => {
        const newInitialState = assetConfig?.initialState || {};
        baseResetForm(newInitialState);
        setResults(null);
        clearAiInsight();
    }, [selectedAssetId, assetConfig, baseResetForm, clearAiInsight]);
    
    // Effect to handle the pre-2001 property special case.
    useEffect(() => {
        if (assetConfig?.id === 'realestate' && formData.isPre2001Property) {
            const cost = parseFloat(String(formData.originalCostPre2001).replace(/,/g, '')) || 0;
            const fmv = parseFloat(String(formData.fmvOnApr12001).replace(/,/g, '')) || 0;
            setFormData(prev => ({
                ...prev,
                purchasePrice: String(Math.max(cost, fmv)),
                purchaseDate: '2001-04-01'
            }));
        }
    }, [assetConfig, formData.isPre2001Property, formData.originalCostPre2001, formData.fmvOnApr12001, setFormData]);

    // Callback for form validation.
    const validateForm = useCallback(() => {
        // Don't validate if there's no config.
        if (!assetConfig) return false;

        const errors = {};
        if (!formData.purchasePrice) errors.purchasePrice = "Purchase price is required.";
        if (!formData.salePrice) errors.salePrice = "Sale price is required.";
        if (!formData.purchaseDate) errors.purchaseDate = "Purchase date is required.";
        if (!formData.saleDate) errors.saleDate = "Sale date is required.";
        if (!formData.quantity || parseFloat(formData.quantity) <= 0) errors.quantity = "Quantity must be positive.";

        if (assetConfig.id === 'preciousmetals' && !formData.measurementUnit) {
            errors.measurementUnit = "Unit is required.";
        }
        
        const needsIncome = assetConfig.needsOtherIncome?.(formData);
        if (needsIncome && !formData.otherIncome) {
             errors.otherIncome = "Annual income is required for slab rate calculation.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData, assetConfig, setFormErrors]);

    // Callback to run the main tax calculation.
    const runCalculation = useCallback(() => {
        if (!assetConfig) return; // Don't run if no asset is selected.

        const dateErrorCheck = new Date(formData.saleDate) < new Date(formData.purchaseDate);
        if (!validateForm() || dateErrorCheck) {
            return;
        }
        const calcResults = calculateTax(formData, selectedAssetId);
        setResults(calcResults);
        clearAiInsight();
    }, [validateForm, formData, selectedAssetId, assetConfig, clearAiInsight]);

    // Callback to reset the calculator state.
    const resetCalculator = useCallback(() => {
        if (!assetConfig) return;
        baseResetForm(assetConfig.initialState);
        setResults(null);
        clearAiInsight();
    }, [baseResetForm, assetConfig, clearAiInsight]);
    
    // The hook always returns a consistent shape.
    return {
        formData,
        handleInputChange,
        formErrors,
        results,
        aiInsight,
        isAiLoading,
        aiError,
        assetConfig,
        runCalculation,
        getAiAdvice,
        resetCalculator,
    };
};