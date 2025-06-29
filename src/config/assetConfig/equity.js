import { TrendingUp } from 'lucide-react';
// NOTE: The component import below will throw an error until Step 6 is complete. This is expected.
import { EquityFields } from '../../features/calculator/components/assetSpecificForms/EquityFields';

export const equityConfig = {
    id: 'equity',
    title: 'Equity & Stocks',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    stcg: '20%',
    ltcg: '12.5% (> 1.25L)',
    description: 'NSE/BSE listed shares, IPOs, etc.',
    formComponent: EquityFields,
    initialState: {},
    placeholders: {
        purchasePrice: 'e.g., 150.50',
        salePrice: 'e.g., 250.75',
        quantity: 'e.g., 100 shares',
        expenses: 'Brokerage, STT, etc.',
        fmvOnJan312018: 'e.g., 1200',
    },
};