import React, { useState, useMemo } from 'react';
import { RotateCcw, Calendar, AlertCircle } from 'lucide-react';

import FormattedNumberInput from '../../../components/common/FormattedNumberInput';
import NumberInputWithControls from '../../../components/common/NumberInputWithControls';
import ModernCalendar from '../../../components/common/ModernCalendar';
import InputError from '../../../components/common/InputError';
import { useDateValidation } from '../../../hooks/useDateValidation';
import { formatDateForDisplay } from '../../../utils/formatters';

const CalculatorForm = ({ assetConfig, formData, handleInputChange, formErrors, runCalculation, resetCalculator }) => {
    const [activeCalendar, setActiveCalendar] = useState(null);
    const { dateError, holdingPeriodText } = useDateValidation(formData.purchaseDate, formData.saleDate, formData.isGrandfathered, formData.isPre2001Property);

    // --- NEW: This logic determines if the LTCG options should be shown ---
    const showLtcgOptions = useMemo(() => {
        if (assetConfig.id !== 'realestate' || !formData.purchaseDate || !formData.saleDate) {
            return false;
        }
        const purchaseDateObj = new Date(formData.purchaseDate);
        const saleDateObj = new Date(formData.saleDate);
        const ltcgCutoffDate = new Date(purchaseDateObj);
        ltcgCutoffDate.setFullYear(ltcgCutoffDate.getFullYear() + 2);
        return saleDateObj > ltcgCutoffDate;
    }, [assetConfig.id, formData.purchaseDate, formData.saleDate]);


    const getUnitLabel = (unit) => {
        if (!unit) return '';
        const labels = { '10gm': ' per 10g', 'gm': ' per gm', 'kg': ' per kg', 'carat': ' per carat', 'unit': ' per unit' };
        return labels[unit] || '';
    };

    const AssetSpecificComponent = assetConfig.formComponent;
    const needsIncomeField = assetConfig.needsOtherIncome?.(formData);

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="space-y-4">
                
                <AssetSpecificComponent
                    formData={formData}
                    onChange={handleInputChange}
                    errors={formErrors}
                    placeholders={assetConfig.placeholders}
                />

                {/* --- NEW: This block renders the LTCG options --- */}
                {showLtcgOptions && (
                    <div className="bg-fuchsia-500/10 p-4 rounded-xl border border-fuchsia-400/20 space-y-3">
                        <label className="text-sm font-medium text-slate-300">LTCG Tax Calculation Method<span className="text-red-500 ml-1">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button type="button" onClick={() => handleInputChange('ltcgOption', 'withIndexation')} className={`p-3 text-center rounded-lg text-sm transition-all ${formData.ltcgOption === 'withIndexation' ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400' : 'bg-white/10 hover:bg-white/20'}`}>20% with Indexation</button>
                            <button type="button" onClick={() => handleInputChange('ltcgOption', 'withoutIndexation')} className={`p-3 text-center rounded-lg text-sm transition-all ${formData.ltcgOption === 'withoutIndexation' ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400' : 'bg-white/10 hover:bg-white/20'}`}>12.5% without Indexation</button>
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Purchase Price (₹){getUnitLabel(formData.measurementUnit)}<span className="text-red-500 ml-1">*</span></label>
                        <FormattedNumberInput value={formData.purchasePrice} onChange={(value) => handleInputChange('purchasePrice', value)} placeholder={assetConfig.placeholders.purchasePrice} error={formErrors.purchasePrice} disabled={formData.isPre2001Property}/>
                        <InputError message={formErrors.purchasePrice} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Sale Price (₹){getUnitLabel(formData.measurementUnit)}<span className="text-red-500 ml-1">*</span></label>
                        <FormattedNumberInput value={formData.salePrice} onChange={(value) => handleInputChange('salePrice', value)} placeholder={assetConfig.placeholders.salePrice} error={formErrors.salePrice} />
                        <InputError message={formErrors.salePrice} />
                    </div>
                </div>

                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Purchase Date Input */}
                        <div className="relative"> {/* <--- THIS 'relative' CLASS IS THE FIX */}
                            <label className="block text-sm font-medium text-slate-300 mb-2">Purchase Date<span className="text-red-500 ml-1">*</span></label>
                             <div className="relative date-input-wrapper">
                                 <input 
                                     type="text" 
                                     readOnly 
                                     onClick={() => setActiveCalendar('purchase')} 
                                     value={formatDateForDisplay(formData.purchaseDate)}
                                     className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 cursor-pointer ${formErrors.purchaseDate || (dateError && dateError.includes("grandfathering")) ? 'border-red-500/50 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500'}`} disabled={formData.isPre2001Property} 
                                     placeholder="Select Date"
                                 />
                                 <button type="button" onClick={() => setActiveCalendar('purchase')}><Calendar className="w-5 h-5 text-slate-400"/></button>
                             </div>
                             {activeCalendar === 'purchase' && <ModernCalendar selectedDate={formData.purchaseDate} onChange={(date) => {handleInputChange('purchaseDate', date); setActiveCalendar(null);}} onClose={() => setActiveCalendar(null)} maxDate={formData.isGrandfathered ? "2018-01-31" : new Date().toISOString().split("T")[0]} />}
                             <InputError message={formErrors.purchaseDate} />
                        </div>
                        {/* Sale Date Input */}
                        <div className="relative"> {/* <--- THIS 'relative' CLASS IS THE FIX */}
                            <label className="block text-sm font-medium text-slate-300 mb-2">Sale Date<span className="text-red-500 ml-1">*</span></label>
                            <div className="relative date-input-wrapper">
                                <input 
                                    type="text" 
                                    readOnly 
                                    onClick={() => setActiveCalendar('sale')} 
                                    value={formatDateForDisplay(formData.saleDate)} 
                                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 cursor-pointer ${formErrors.saleDate || (dateError && !dateError.includes("grandfathering")) ? 'border-red-500/50 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500'}`} 
                                    placeholder="Select Date"
                                />
                                <button type="button" onClick={() => setActiveCalendar('sale')}><Calendar className="w-5 h-5 text-slate-400"/></button>
                            </div>
                            {activeCalendar === 'sale' && <ModernCalendar selectedDate={formData.saleDate} onChange={(date) => {handleInputChange('saleDate', date); setActiveCalendar(null);}} onClose={() => setActiveCalendar(null)} maxDate={new Date().toISOString().split("T")[0]} />}
                            <InputError message={formErrors.saleDate} />
                        </div>
                    </div>
                    {holdingPeriodText && <p className="text-xs text-slate-400 mt-2 text-right">{holdingPeriodText}</p>}
                    {dateError && <div className="flex items-center text-sm text-red-400 bg-red-500/10 p-3 rounded-lg mt-2"><AlertCircle className="w-5 h-5 mr-2" />{dateError}</div>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Quantity<span className="text-red-500 ml-1">*</span></label>
                        <NumberInputWithControls value={formData.quantity} onChange={(value) => handleInputChange('quantity', value)} placeholder={assetConfig.placeholders.quantity} error={formErrors.quantity} />
                        <InputError message={formErrors.quantity} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Expenses (₹)</label>
                        <FormattedNumberInput value={formData.expenses} onChange={(value) => handleInputChange('expenses', value)} placeholder={assetConfig.placeholders.expenses} disabled={assetConfig.id === 'crypto'}/>
                    </div>
                </div>

                {needsIncomeField && (
                    <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-400/20 transition-all duration-300">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Annual Income (for slab rate)<span className="text-red-500 ml-1">*</span></label>
                        <FormattedNumberInput value={formData.otherIncome} onChange={(value) => handleInputChange('otherIncome', value)} placeholder="e.g., 900000" error={formErrors.otherIncome} />
                        <InputError message={formErrors.otherIncome} />
                    </div>
                )}
                
                <div className="flex items-center gap-4 mt-4">
                    <button id="calculate-tax-btn" onClick={runCalculation} disabled={!!dateError} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:scale-100">Calculate Tax</button>
                    <button onClick={resetCalculator} title="Reset Form" className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-300 border border-white/20"><RotateCcw className="w-5 h-5"/></button>
                </div>

            </div>
        </div>
    );
};

export default CalculatorForm;