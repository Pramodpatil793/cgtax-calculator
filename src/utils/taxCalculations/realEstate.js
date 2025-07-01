import { getFinancialYear, getMarginalTaxRate, parseNumeric } from './helpers';
import { CII_DATA } from '../../constants/ciiData';

export const calculateRealEstateTax = (formData) => {
    const {
        purchasePrice, salePrice, quantity, expenses,
        otherIncome, purchaseDate, saleDate, ltcgOption
    } = formData;

    const purchase = parseNumeric(purchasePrice);
    const sale = parseNumeric(salePrice);
    const qty = parseNumeric(quantity) || 1;
    const exp = parseNumeric(expenses);
    const inc = parseNumeric(otherIncome);

    const totalPurchase = purchase * qty;
    const totalSale = sale * qty;

    const purchaseDateObj = new Date(purchaseDate);
    const saleDateObj = new Date(saleDate);
    
    const ltcgCutoffDate = new Date(purchaseDateObj);
    ltcgCutoffDate.setFullYear(ltcgCutoffDate.getFullYear() + 2);
    const isLongTerm = saleDateObj > ltcgCutoffDate;

    let result = {
        totalPurchase, totalSale, totalExpenses: exp,
        isLongTerm, exemption: 0, relevantLaw: 'as per standard income tax rules',
        assetType: 'Real Estate',
        taxWithIndexation: null,
        taxWithoutIndexation: null,
        calculationError: null, // Initialize error as null
    };

    if (isLongTerm) {
        const purchaseFY = getFinancialYear(purchaseDate);
        const saleFY = getFinancialYear(saleDate);
        const ciiPurchase = CII_DATA[purchaseFY];
        const ciiSale = CII_DATA[saleFY];
        let indexedCost = totalPurchase;
        
        // --- THIS IS THE NEW ERROR-CHECKING LOGIC ---
        if (ltcgOption === 'withIndexation') {
            if (!ciiSale) {
                result.calculationError = `Indexation cannot be calculated. The official CII for the sale year (${saleFY}) has not been released yet.`;
                result.netGain = totalSale - totalPurchase - exp; // Show non-indexed gain as a reference
            } else if (!ciiPurchase) {
                result.calculationError = `Indexation cannot be calculated. The official CII for the purchase year (${purchaseFY}) is not available.`;
                result.netGain = totalSale - totalPurchase - exp;
            } else {
                indexedCost = totalPurchase * (ciiSale / ciiPurchase);
                result.netGain = totalSale - indexedCost - exp;
            }
            result.taxRate = 0.20;
            result.taxType = 'LTCG (20% with Indexation)';
            result.indexedCost = indexedCost;
            result.purchaseFY = purchaseFY;
            result.saleFY = saleFY;
            result.ciiPurchaseValue = ciiPurchase;
            result.ciiSaleValue = ciiSale;
        } else { // 'withoutIndexation'
            result.netGain = totalSale - totalPurchase - exp;
            result.taxRate = 0.125;
            result.taxType = 'LTCG (12.5% without Indexation)';
            result.indexedCost = 0;
        }
    } else {
        // --- STCG Calculation ---
        result.netGain = totalSale - totalPurchase - exp;
        result.taxRate = getMarginalTaxRate(result.netGain + inc);
        result.taxType = 'STCG (Added to Income)';
    }

    result.taxableGain = result.calculationError ? 0 : Math.max(0, result.netGain);
    result.baseTax = result.taxableGain * result.taxRate;
    result.cess = result.baseTax * 0.04;
    
    return result;
};