import React from 'react';
import { Minus, Plus } from 'lucide-react';

const NumberInputWithControls = ({ value, onChange, placeholder, disabled = false, step = 1, error }) => {
    const handleStep = (direction) => {
        const numericValue = parseFloat(value) || 0;
        const newValue = numericValue + (direction * step);
        onChange(String(Math.max(0, newValue)));
    };

    return (
        <div className="relative">
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-700/50 disabled:cursor-not-allowed pr-16 ${error ? 'border-red-500/50 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500'}`}
                placeholder={placeholder}
            />
            {!disabled && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button type="button" onClick={() => handleStep(-1)} className="p-1 text-slate-400 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50"><Minus className="w-4 h-4"/></button>
                    <button type="button" onClick={() => handleStep(1)} className="p-1 text-slate-400 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50"><Plus className="w-4 h-4"/></button>
                </div>
            )}
        </div>
    );
};

export default NumberInputWithControls;