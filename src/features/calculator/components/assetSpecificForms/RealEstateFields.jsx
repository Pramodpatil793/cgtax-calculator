import React from 'react';
import { Info } from 'lucide-react';
import CustomCheckbox from '../../../../components/common/CustomCheckbox';
import FormattedNumberInput from '../../../../components/common/FormattedNumberInput';

export const RealEstateFields = ({ formData, onChange, placeholders }) => {
    return (
        <div className="bg-cyan-500/10 p-4 rounded-xl border border-cyan-400/20">
            <CustomCheckbox
                id="pre2001"
                label="Property purchased before April 1, 2001?"
                checked={formData.isPre2001Property}
                onChange={(isChecked) => onChange('isPre2001Property', isChecked)}
                tooltipText="For property acquired before April 1, 2001, you can use the Fair Market Value (FMV) as of April 1, 2001 for cost calculation. The higher of actual cost or FMV is used as the purchase price, which can reduce your taxable gain."
            />
            {formData.isPre2001Property && (
                <div className="mt-4 space-y-4 border-t border-cyan-400/20 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Original Cost (before 2001)<span className="text-red-500 ml-1">*</span></label>
                        <FormattedNumberInput 
                            value={formData.originalCostPre2001} 
                            onChange={(value) => onChange('originalCostPre2001', value)} 
                            placeholder={placeholders.originalCostPre2001} 
                        />
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                            <span>Property's Fair Market Value (FMV) on Apr 1, 2001<span className="text-red-500 ml-1">*</span></span>
                            
                            <div className="relative group ml-2">
                                <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 rounded-lg bg-slate-900 border border-slate-600 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <p className="font-bold mb-1">What is Fair Market Value?</p>
                                    <p>It's the estimated price your property would have sold for on Apr 1, 2001. For tax purposes, you can use the <span className="font-bold text-green-400">higher</span> of this FMV or your original cost to calculate capital gains, which can significantly lower your tax.</p>
                                    <p className="mt-2 text-slate-400">It's recommended to get this value from a registered property valuer.</p>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                                </div>
                            </div>
                        </label>
                        
                        <FormattedNumberInput 
                            value={formData.fmvOnApr12001} 
                            onChange={(value) => onChange('fmvOnApr12001', value)}
                            placeholder="e.g., Value from a property valuer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};