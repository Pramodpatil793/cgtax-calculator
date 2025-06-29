import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCalculator } from '../../hooks/useCalculator';

import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';

const AssetCalculatorPage = () => {
    const { assetId } = useParams();
    const {
        formData, handleInputChange, formErrors,
        results, aiInsight, isAiLoading, aiError,
        assetConfig, runCalculation, getAiAdvice, resetCalculator,
    } = useCalculator(assetId);

    if (!assetConfig) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-red-500">Asset Not Found</h2>
                <p className="text-slate-400 mt-2">The calculator for "{assetId}" does not exist.</p>
                <Link to="/calculator" className="text-purple-400 hover:text-purple-300 text-xl mb-4 inline-flex items-center">← Back to Asset Selection</Link>
            </div>
        );
    }
    
    return (
        <div>
            <div className="mb-8">
                <Link to="/calculator" className="text-purple-400 hover:text-purple-300 text-lg mb-4 inline-flex items-center">← Change Asset Type</Link>
                <h1 className="text-3xl font-bold text-white">{assetConfig.title} Calculator</h1>
            </div>
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                <div className="lg:sticky lg:top-24 lg:self-start lg:pr-4 pb-8 lg:pb-0 z-10">
                    <CalculatorForm 
                        assetConfig={assetConfig}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        formErrors={formErrors}
                        runCalculation={runCalculation}
                        resetCalculator={resetCalculator}
                    />
                </div>
                <div className="lg:pl-4 mt-8 lg:mt-0 z-10">
                   <ResultsDisplay 
                        results={results}
                        aiInsight={aiInsight}
                        isAiLoading={isAiLoading}
                        aiError={aiError}
                        getAiAdvice={getAiAdvice}
                   />
                </div>
            </div>
        </div>
    );
};

export default AssetCalculatorPage;