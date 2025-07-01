import { getFinancialYear, getMarginalTaxRate, parseNumeric } from './helpers';
import { CII_DATA } from '../../constants/ciiData';

export const calculatePreciousMetalsTax = (formData) => {
    // This logic is identical to Real Estate for LTCG/STCG, but with a different holding period.
    const {
        purchasePrice, salePrice, quantity, expenses,
        otherIncome, purchaseDate, saleDate
    } = formData;

    const purchase = parseNumeric(purchasePrice);
    const sale = parseNumeric(salePrice);
    const qty = parseNumeric(quantity);
    const exp = parseNumeric(expenses);
    const inc = parseNumeric(otherIncome);

    const totalPurchase = purchase * qty;
    const totalSale = sale * qty;

    const purchaseDateObj = new Date(purchaseDate);
    const saleDateObj = new Date(saleDate);

    // Create a date that is exactly 24 months after the purchase date.
    const ltcgCutoffDate = new Date(purchaseDateObj);
    ltcgCutoffDate.setFullYear(ltcgCutoffDate.getFullYear() + 2);

    // To be LTCG, the sale date must be strictly AFTER this cutoff date.
    const isLongTerm = saleDateObj > ltcgCutoffDate;
    let netGain = 0;
    let indexedCost = 0;
    let taxRate = 0;
    let taxType = '';
    let relevantLaw = 'as per standard income tax rules';
    let purchaseFY = null, saleFY = null, ciiPurchase = null, ciiSale = null;

    if (isLongTerm) {
        purchaseFY = getFinancialYear(purchaseDate);
        saleFY = getFinancialYear(saleDate);
        ciiPurchase = CII_DATA[purchaseFY];
        ciiSale = CII_DATA[saleFY];

        if (ciiPurchase && ciiSale) {
            indexedCost = totalPurchase * (ciiSale / ciiPurchase);
            netGain = totalSale - indexedCost - exp;
        } else {
            netGain = totalSale - totalPurchase - exp;
        }
        taxRate = 0.20;
        taxType = 'LTCG (With Indexation)';
    } else {
        netGain = totalSale - totalPurchase - exp;
        taxRate = getMarginalTaxRate(netGain + inc);
        taxType = 'STCG (Added to Income)';
    }

    const taxableGain = Math.max(0, netGain);
    const baseTax = taxableGain * taxRate;
    const cess = baseTax * 0.04;

    return {
        totalPurchase, totalSale, netGain, isLongTerm, taxRate, exemption: 0,
        taxableGain, baseTax, cess,
        taxType, relevantLaw, indexedCost, assetType: 'Precious Metals & Gems',
        // --- NEW PROPERTIES FOR INDEXATION FORMULA ---
        purchaseFY: isLongTerm ? purchaseFY : null,
        saleFY: isLongTerm ? saleFY : null,
        ciiPurchaseValue: isLongTerm ? ciiPurchase : null,
        ciiSaleValue: isLongTerm ? ciiSale : null, totalExpenses: exp,
    };
};