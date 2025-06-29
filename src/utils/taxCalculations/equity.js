import { parseNumeric } from './helpers';

export const calculateEquityTax = (formData) => {
    const {
        purchasePrice, salePrice, quantity, expenses,
        isGrandfathered, fmvOnJan312018,
        purchaseDate, saleDate
    } = formData;

    const purchase = parseNumeric(purchasePrice);
    const sale = parseNumeric(salePrice);
    const qty = parseNumeric(quantity);
    const exp = parseNumeric(expenses);
    const fmv = parseNumeric(fmvOnJan312018);

    let totalPurchase = purchase * qty;
    const totalSale = sale * qty;

    const purchaseDateObj = new Date(purchaseDate);
    const saleDateObj = new Date(saleDate);
    // Create a date that is exactly 12 months after the purchase date.
    const ltcgCutoffDate = new Date(purchaseDateObj);
    ltcgCutoffDate.setFullYear(ltcgCutoffDate.getFullYear() + 1);

    // To be LTCG, the sale date must be strictly AFTER this cutoff date.
    const isLongTerm = saleDateObj > ltcgCutoffDate;
    
    if (isLongTerm && isGrandfathered && fmv > 0) {
        const actualCost = totalPurchase;
        const fmvTotal = fmv * qty;
        // Cost of acquisition is the higher of actual cost or the lower of FMV and Sale Price
        const effectiveFMV = Math.min(fmvTotal, totalSale);
        totalPurchase = Math.max(actualCost, effectiveFMV);
    }
    
    const netGain = totalSale - totalPurchase - exp;
    const exemption = isLongTerm ? Math.min(Math.max(0, netGain), 125000) : 0; // LTCG exemption is 1.25 Lakh
    const taxableGain = Math.max(0, netGain - exemption);

    const taxRate = isLongTerm ? 0.125 : 0.20; // LTCG @12.5%, STCG @20%
    const baseTax = taxableGain * taxRate;
    const cess = baseTax * 0.04;
    
    return {
        totalPurchase,
        totalSale,
        netGain,
        isLongTerm,
        taxRate,
        exemption,
        taxableGain,
        baseTax,
        cess,
        taxType: isLongTerm ? 'LTCG (Sec 112A)' : 'STCG (Sec 111A)',
        relevantLaw: isLongTerm ? 'under Section 112A' : 'under Section 111A',
        indexedCost: 0, // No indexation for equities
        assetType: 'Equity & Stocks',
        totalExpenses: exp,
    };
};