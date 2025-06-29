import { parseNumeric } from './helpers';

export const calculateCryptoTax = (formData) => {
    const { purchasePrice, salePrice, quantity, purchaseDate, saleDate } = formData;
    
    const purchase = parseNumeric(purchasePrice);
    const sale = parseNumeric(salePrice);
    const qty = parseNumeric(quantity);
    
    // For crypto, no expenses or indexation are allowed.
    const totalPurchase = purchase * qty;
    const totalSale = sale * qty;
    
    const purchaseDateObj = new Date(purchaseDate);
    const saleDateObj = new Date(saleDate);
    const holdingMonths = (saleDateObj - purchaseDateObj) / (1000 * 60 * 60 * 24 * 30.4375);
    
    // Holding period doesn't matter for tax rate but good to have
    const isLongTerm = holdingMonths >= 36;
    
    const netGain = totalSale - totalPurchase;
    const taxRate = 0.30; // Flat 30% tax on Virtual Digital Assets (VDA)
    
    const taxableGain = Math.max(0, netGain);
    const baseTax = taxableGain * taxRate;
    const cess = baseTax * 0.04;
    
    return {
        totalPurchase,
        totalSale,
        netGain,
        isLongTerm, // Technically irrelevant for tax rate
        taxRate,
        exemption: 0,
        taxableGain,
        baseTax,
        cess,
        holdingPeriod: Math.floor(holdingMonths),
        taxType: 'Flat Rate (VDA)',
        relevantLaw: 'under Section 115BBH',
        indexedCost: 0,
        assetType: 'Cryptocurrency',
    };
};