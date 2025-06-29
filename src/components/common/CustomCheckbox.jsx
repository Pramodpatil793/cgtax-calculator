import React from 'react';
import { CheckCircle, Info } from 'lucide-react';

const CustomCheckbox = ({ id, label, checked, onChange, tooltipText, disabled = false }) => (
    <div className="flex items-center">
        <label htmlFor={id} className={`flex items-center text-sm font-medium text-slate-300 select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <div className="relative">
                <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
                <div className={`w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${checked ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 shadow-lg shadow-purple-500/30' : 'bg-slate-700/50 border-slate-600'}`}>
                    {checked && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
            </div>
            <span className="ml-3 flex items-center">{label}
                {tooltipText && (
                    <div className="relative group ml-2" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                        <Info className="w-4 h-4 text-slate-400" />
                        <div className="absolute bottom-full right-0 mb-2 w-60 sm:w-72 p-3 rounded-lg bg-slate-800 border border-slate-600 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {tooltipText}
                            <div className="absolute top-full right-2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                        </div>
                    </div>
                )}
            </span>
        </label>
    </div>
);

export default CustomCheckbox;