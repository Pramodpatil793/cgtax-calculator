import React from 'react';
import { EquityFields } from './EquityFields'; // Reuse for equity MF

export const MutualFundFields = ({ formData, onChange, placeholders }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Mutual Fund Type<span className="text-red-500 ml-1">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => onChange('mutualFundType', 'equity')} className={`p-4 rounded-xl text-sm border-2 transition-all duration-200 ${formData.mutualFundType === 'equity' ? 'border-green-500 bg-green-500/20 text-green-400' : 'border-white/20 bg-white/5 text-slate-300 hover:border-white/40'}`}>
                        Equity & Equity-oriented
                    </button>
                    <button type="button" onClick={() => onChange('mutualFundType', 'debt')} className={`p-4 rounded-xl text-sm border-2 transition-all duration-200 ${formData.mutualFundType === 'debt' ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/20 bg-white/5 text-slate-300 hover:border-white/40'}`}>
                        Debt & Other
                    </button>
                </div>
            </div>

            {formData.mutualFundType === 'equity' && (
                <EquityFields formData={formData} onChange={onChange} placeholders={placeholders} />
            )}
        </div>
    );
};