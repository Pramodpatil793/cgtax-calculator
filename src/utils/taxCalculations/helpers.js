export const getFinancialYear = (date) => {
    // Ensure we're working with a valid Date object
    const d = new Date(date);

    // Adjust for timezone offset to prevent date from shifting days
    const adjustedDate = new Date(d.valueOf() + d.getTimezoneOffset() * 60000);
    
    const year = adjustedDate.getFullYear();
    const month = adjustedDate.getMonth(); // 0 = January, 3 = April

    // The financial year starts in April (month index 3).
    // If the month is April or later, the FY starts in the current year.
    if (month >= 3) {
        // e.g., for May 2023, the FY is 2023-24
        const nextYear = (year + 1).toString().slice(-2);
        return `${year}-${nextYear}`;
    } else {
        // If the month is Jan, Feb, or Mar, the FY started in the previous year.
        // e.g., for Feb 2024, the FY is 2023-24
        const currentYear = year.toString().slice(-2);
        return `${year - 1}-${currentYear}`;
    }
};

// Based on the New Tax Regime Slabs for FY 2024-25 (AY 2025-26)
export const getMarginalTaxRate = (income) => {
    if (income <= 300000) return 0;
    if (income <= 600000) return 0.05;
    if (income <= 900000) return 0.10;
    if (income <= 1200000) return 0.15;
    if (income <= 1500000) return 0.20;
    return 0.30;
};

export const parseNumeric = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        return parseFloat(val.replace(/,/g, '')) || 0;
    }
    return 0;
};