import { Gem } from 'lucide-react';
// NOTE: The component import below will throw an error until Step 6 is complete. This is expected.
import { PreciousMetalsFields } from '../../features/calculator/components/assetSpecificForms/PreciousMetalsFields';

export const preciousMetalsConfig = {
    id: 'preciousmetals',
    title: 'Precious Metals & Gems',
    icon: Gem,
    color: 'from-yellow-500 to-amber-600',
    stcg: 'Slab Rate',
    ltcg: '12.5% without Indexation',
    description: 'Gold, silver, diamonds, etc.',
    formComponent: PreciousMetalsFields,
    initialState: {
        measurementUnit: 'gm'
    },
    placeholders: {
        purchasePrice: 'e.g., 6500',
        salePrice: 'e.g., 7200',
        quantity: 'e.g., 10',
        expenses: 'Making charges, storage, etc.',
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