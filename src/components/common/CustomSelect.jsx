import React from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder, error }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 appearance-none ${!value ? 'text-slate-400' : 'text-white'} ${error ? 'border-red-500/50 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500'}`}
        >
            <option value="" disabled>{placeholder}</option>
            {options.map(opt => <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">{opt.label}</option>)}
        </select>
        <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
);

export default CustomSelect;