import React from 'react';
import { TrendingUp, GitCompareArrows, Globe } from 'lucide-react'; // Import new icons
import { EquityFields } from './EquityFields';

export const MutualFundFields = ({ formData, onChange, placeholders }) => {
    
    const fundTypes = [
        { 
            id: 'equity', 
            label: 'Equity Fund', 
            desc: '> 65% in Indian Stocks',
            icon: TrendingUp,
            color: 'green'
        },
        { 
            id: 'hybrid', 
            label: 'Hybrid / Old Debt', 
            desc: '35-65% equity, or any Debt fund bought before 1-Apr-2023',
            icon: GitCompareArrows,
            color: 'orange'
        },
        { 
            id: 'debt_new', 
            label: 'New Debt / Intl.', 
            desc: '< 35% equity, bought on/after 1-Apr-2023',
            icon: Globe,
            color: 'blue'
        }
    ];

    const getColorClasses = (type, color) => {
        if (formData.mutualFundType === type) {
            switch(color) {
                case 'green': return 'bg-green-500/10 text-green-300 ring-2 ring-green-500';
                case 'orange': return 'bg-orange-500/10 text-orange-300 ring-2 ring-orange-500';
                case 'blue': return 'bg-sky-500/10 text-sky-300 ring-2 ring-sky-500';
                default: return '';
            }
        }
        return 'bg-slate-700/50 ring-1 ring-transparent hover:ring-slate-500 text-slate-400';
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Select Mutual Fund Category<span className="text-red-500 ml-1">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {fundTypes.map(fund => {
                        const Icon = fund.icon;
                        return (
                            <button 
                                key={fund.id}
                                type="button" 
                                onClick={() => onChange('mutualFundType', fund.id)} 
                                className={`p-4 rounded-xl text-left transition-all duration-300 transform hover:-translate-y-1 ${getColorClasses(fund.id, fund.color)}`}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-base text-white">{fund.label}</p>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <p className="text-xs mt-2">{fund.desc}</p>
                            </button>
                        )
                    })}
                </div>
            </div>
            {formData.mutualFundType === 'equity' && (
                <div className="pt-4">
                    <EquityFields formData={formData} onChange={onChange} placeholders={placeholders} />
                </div>
            )}
        </div>
    );
};