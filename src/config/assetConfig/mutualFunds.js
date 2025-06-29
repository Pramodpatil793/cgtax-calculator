import { BarChart3 } from 'lucide-react';
// NOTE: The component import below will throw an error until Step 6 is complete. This is expected.
import { MutualFundFields } from '../../features/calculator/components/assetSpecificForms/MutualFundFields';

export const mutualFundsConfig = {
    id: 'mutualfunds',
    title: 'Mutual Funds',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    stcg: 'Slab Rate (Debt)',
    ltcg: '12.5% w/ index (Debt)',
    description: 'Equity, Debt, and Hybrid funds.',
    formComponent: MutualFundFields,
    initialState: {
        mutualFundType: 'equity',
    },
    placeholders: {
        purchasePrice: 'e.g., 45.20 (NAV)',
        salePrice: 'e.g., 80.50 (NAV)',
        quantity: 'e.g., 500 units',
        expenses: 'Brokerage, exit load, etc.',
    },
    needsOtherIncome: (formData) => {
        // Only applies to debt funds
        if (formData.mutualFundType !== 'debt') {
            return false;
        }

        // Don't run if dates are missing
        if (!formData.purchaseDate || !formData.saleDate) {
            return false;
        }

        const purchaseDate = new Date(formData.purchaseDate);
        const saleDate = new Date(formData.saleDate);

        // If dates are invalid, don't show the field
        if (isNaN(purchaseDate.getTime()) || isNaN(saleDate.getTime())) {
            return false;
        }

        // As per the new rule, any debt fund bought on or after Apr 1, 2023 is taxed at slab rate.
        const newRuleCutoffDate = new Date('2023-04-01');
        if (purchaseDate >= newRuleCutoffDate) {
            return true; // We need the income field.
        }

        // For older funds, determine if it's STCG (<= 36 months) using precise date math.
        const ltcgCutoffDate = new Date(purchaseDate);
        ltcgCutoffDate.setFullYear(ltcgCutoffDate.getFullYear() + 3);
        
        // It's STCG if the sale date is on or before the 3-year anniversary date.
        // If it's STCG, we need the income field.
        return saleDate <= ltcgCutoffDate;
    }
};