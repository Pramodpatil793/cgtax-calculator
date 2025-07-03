import { getFinancialYear, getMarginalTaxRate, parseNumeric } from './helpers';
import { CII_DATA } from '../../constants/ciiData';
import { calculateEquityTax } from './equity';

export const calculateMutualFundsTax = (formData) => {
    const {
        mutualFundType, purchaseDate, saleDate,
        purchasePrice, salePrice, quantity, expenses, otherIncome
    } = formData;

    // 1. Handle Equity-Oriented Funds (>65% equity)
    if (mutualFundType === 'equity') {
        const equityResults = calculateEquityTax(formData);
        return { ...equityResults, assetType: 'Equity Mutual Fund' };
    }

    // Common variables for non-equity funds
    const purchaseDateObj = new Date(purchaseDate);
    const saleDateObj = new Date(saleDate);
    const purchase = parseNumeric(purchasePrice);
    const sale = parseNumeric(salePrice);
    const qty = parseNumeric(quantity);
    const exp = parseNumeric(expenses);
    const inc = parseNumeric(otherIncome);
    const totalPurchase = purchase * qty;
    const totalSale = sale * qty;

    let netGain = 0;
    let taxRate = 0;
    let taxType = '';
    let relevantLaw = 'as per standard income tax rules';
    let isLongTerm = false;
    
    // 2. Handle New Debt/Gold/Intl. Funds (bought on/after 1-Apr-2023)
    if (mutualFundType === 'debt_new') {
        netGain = totalSale - totalPurchase - exp;
        taxRate = getMarginalTaxRate(netGain + inc);
        taxType = 'Gain Added to Income';
        relevantLaw = 'as per amendment to Finance Act, 2023';
        isLongTerm = false; // Always treated as short-term for tax rate
    }
    
    // 3. Handle Hybrid / Old Debt Funds (bought before 1-Apr-2023)
    if (mutualFundType === 'hybrid') {
        const ltcgCutoffDate = new Date(purchaseDateObj);
        ltcgCutoffDate.setFullYear(ltcgCutoffDate.getFullYear() + 2); // 24 months holding period
        isLongTerm = saleDateObj > ltcgCutoffDate;

        netGain = totalSale - totalPurchase - exp; // Indexation is no longer applicable

        if (isLongTerm) {
            taxRate = 0.125; // CORRECTED: Flat 12.5% on LTCG
            taxType = 'LTCG (Without Indexation)';
        } else {
            taxRate = getMarginalTaxRate(netGain + inc); // STCG taxed at slab rates
            taxType = 'STCG (Added to Income)';
        }
    }

    const taxableGain = Math.max(0, netGain);
    const baseTax = taxableGain * taxRate;
    const cess = baseTax * 0.04;

    return {
        totalPurchase, totalSale, netGain, isLongTerm, taxRate, exemption: 0,
        taxableGain, baseTax, cess,
        taxType, relevantLaw, 
        indexedCost: 0, // No indexation
        assetType: mutualFundType === 'hybrid' ? 'Hybrid/Old Debt Fund' : 'Debt/Gold/Intl. Fund',
        totalExpenses: exp,
    };
};