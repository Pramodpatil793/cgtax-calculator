import { calculateEquityTax } from './equity';
import { calculateMutualFundsTax } from './mutualFunds';
import { calculateRealEstateTax } from './realEstate';
import { calculatePreciousMetalsTax } from './preciousMetals';
import { calculateCryptoTax } from './crypto';
import { TaxCalculationResult } from '../../models/TaxCalculationResult';

const calculationStrategies = {
    equity: calculateEquityTax,
    mutualfunds: calculateMutualFundsTax,
    realestate: calculateRealEstateTax,
    preciousmetals: calculatePreciousMetalsTax,
    crypto: calculateCryptoTax,
};

export const calculateTax = (formData, selectedAssetId) => {
    const strategy = calculationStrategies[selectedAssetId];

    if (strategy) {
        const rawResults = strategy(formData);
        // Wrap the raw result in our data model
        return new TaxCalculationResult(rawResults);
    } else {
        console.error(`No calculation strategy found for asset: ${selectedAssetId}`);
        return null;
    }
};