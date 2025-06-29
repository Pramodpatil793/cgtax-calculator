import { Building } from 'lucide-react';
// NOTE: The component import below will throw an error until Step 6 is complete. This is expected.
import { RealEstateFields } from '../../features/calculator/components/assetSpecificForms/RealEstateFields';

export const realEstateConfig = {
    id: 'realestate',
    title: 'Real Estate',
    icon: Building,
    color: 'from-orange-500 to-red-600',
    stcg: 'Slab Rate',
    ltcg: '20% with Indexation',
    description: 'Residential/commercial properties and land.',
    formComponent: RealEstateFields,
    initialState: {},
    placeholders: {
        purchasePrice: 'e.g., 5000000',
        salePrice: 'e.g., 7500000',
        quantity: 'e.g., 1 property',
        expenses: 'Brokerage, stamp duty, legal fees',
        originalCostPre2001: 'e.g., 500000',
        fmvOnApr12001: 'e.g., 800000',
    },
    needsOtherIncome: (formData) => {
        if (!formData.purchaseDate || !formData.saleDate) return false;

        const purchaseDate = new Date(formData.purchaseDate);
        const saleDate = new Date(formData.saleDate);

        if (isNaN(purchaseDate.getTime()) || isNaN(saleDate.getTime())) return false;

        // Create a date that is exactly 24 months (2 years) after purchase
        const ltcgCutoffDate = new Date(purchaseDate);
        ltcgCutoffDate.setFullYear(ltcgCutoffDate.getFullYear() + 2);

        // It's STCG if the sale date is on or before the 2-year anniversary.
        // If it's STCG, we need the income field.
        return saleDate <= ltcgCutoffDate;
    }
};