import { Smartphone } from 'lucide-react';
// NOTE: The component import below will throw an error until Step 6 is complete. This is expected.
import { CryptoFields } from '../../features/calculator/components/assetSpecificForms/CryptoFields';

export const cryptoConfig = {
    id: 'crypto',
    title: 'Cryptocurrency',
    icon: Smartphone,
    color: 'from-purple-500 to-indigo-600',
    stcg: '30% + cess',
    ltcg: '30% + cess',
    description: 'All Virtual Digital Assets (VDAs).',
    formComponent: CryptoFields,
    initialState: {},
    placeholders: {
        purchasePrice: 'e.g., 2500000',
        salePrice: 'e.g., 4500000',
        quantity: 'e.g., 0.5',
        expenses: 'No deductions allowed',
    },
};