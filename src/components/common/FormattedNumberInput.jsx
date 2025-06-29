import React from 'react';
import { formatIndianCurrency } from '../../utils/formatters';

const FormattedNumberInput = ({ value, onChange, placeholder, disabled = false, error }) => {
    const handleChange = (e) => {
        const { value: rawValue } = e.target;
        // Allow only numbers and a single decimal point
        const numericValue = rawValue.replace(/[^0-9.]/g, '');
        if (numericValue.split('.').length > 2) return;
        onChange(numericValue);
    };

    return (
        <input
            type="text"
            inputMode="decimal"
            value={formatIndianCurrency(value)}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-700/50 disabled:cursor-not-allowed ${error ? 'border-red-500/50 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500'}`}
            placeholder={placeholder}
        />
    );
};

export default FormattedNumberInput;