import { getFinancialYear, getMarginalTaxRate, parseNumeric } from './helpers';
import { CII_DATA } from '../../constants/ciiData';
import { calculateEquityTax } from './equity'; // Reuse equity logic for equity funds

export const calculateMutualFundsTax = (formData) => {
    const {
        mutualFundType, purchaseDate, saleDate,
        purchasePrice, salePrice, quantity, expenses, otherIncome
    } = formData;

    if (mutualFundType === 'equity') {
        // Equity funds follow the same rules as stocks
        const equityResults = calculateEquityTax(formData);
        return { ...equityResults, assetType: 'Equity Mutual Fund' };
    }

    // --- Logic for Debt Funds ---
    const purchaseDateObj = new Date(purchaseDate);
    const saleDateObj = new Date(saleDate);
    
    const purchase = parseNumeric(purchasePrice);
    const sale = parseNumeric(salePrice);
    const qty = parseNumeric(quantity);
    const exp = parseNumeric(expenses);
    const inc = parseNumeric(otherIncome);

    const totalPurchase = purchase * qty;
    const totalSale = sale * qty;
    
    const newRuleCutoffDate = new Date('2023-04-01');
    const isUnderNewRule = purchaseDateObj >= newRuleCutoffDate;

    // Create a date that is exactly 36 months after the purchase date.
    const ltcgCutoffDate = new Date(purchaseDateObj);
    ltcgCutoffDate.setFullYear(ltcgCutoffDate.getFullYear() + 3);

    // To be LTCG, the sale date must be strictly AFTER this cutoff date.
    const isLongTerm = saleDateObj > ltcgCutoffDate && !isUnderNewRule;
    
    let netGain = 0;
    let indexedCost = 0;
    let taxRate = 0;
    let taxType = '';
    let relevantLaw = 'as per standard income tax rules';
    let purchaseFY = null, saleFY = null, ciiPurchase = null, ciiSale = null, calculationError = null;
    

    if (isLongTerm) {
        // Old regime (purchased before 1-Apr-2023, held > 24 months) gets indexation
        purchaseFY = getFinancialYear(purchaseDate);
        saleFY = getFinancialYear(saleDate);
        ciiPurchase = CII_DATA[purchaseFY];
        ciiSale = CII_DATA[saleFY];

        console.log("--- CII DEBUG DATA ---", {
            purchaseDate_from_form: purchaseDate,
            saleDate_from_form: saleDate,
            generated_purchaseFY_key: purchaseFY,
            generated_saleFY_key: saleFY,
            lookup_result_for_purchase: ciiPurchase,
            lookup_result_for_sale: ciiSale
        });

        if (ciiPurchase && ciiSale) {
            indexedCost = totalPurchase * (ciiSale / ciiPurchase);
            netGain = totalSale - indexedCost - exp;
        } else {
            console.log("cii data not found");
            netGain = totalSale - totalPurchase - exp; // Fallback if CII data is missing
        }
        taxRate = 0.125; // 12.5% with indexation
        taxType = 'LTCG (With Indexation)';
    } else {
        // STCG for old regime, or any gain under new regime
        netGain = totalSale - totalPurchase - exp;
        taxRate = getMarginalTaxRate(netGain + inc);
        taxType = 'Gain Added to Income';
        relevantLaw = isUnderNewRule 
            ? 'as per amendment to Finance Act, 2023'
            : 'as per standard income tax rules';
    }
    
    const taxableGain = Math.max(0, netGain);
    const baseTax = taxableGain * taxRate;
    const cess = baseTax * 0.04;

    return {
        totalPurchase, totalSale, netGain, isLongTerm, taxRate, exemption: 0,
        taxableGain, baseTax, cess,
        taxType, relevantLaw, indexedCost, assetType: 'Debt Mutual Fund',
        calculationError,
        // --- NEW PROPERTIES FOR INDEXATION FORMULA ---
        purchaseFY: isLongTerm ? purchaseFY : null,
        saleFY: isLongTerm ? saleFY : null,
        ciiPurchaseValue: isLongTerm ? ciiPurchase : null,
        ciiSaleValue: isLongTerm ? ciiSale : null, totalExpenses: exp
    };
};