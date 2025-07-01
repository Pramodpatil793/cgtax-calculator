import React from 'react';
// 1. Add 'Info' to the import from lucide-react
import { Calculator, CheckCircle, Sparkles, BrainCircuit, Landmark, AlertCircle, Info, TrendingUp } from 'lucide-react';

const ResultsDisplay = ({ results, aiInsight, isAiLoading, aiError, getAiAdvice, holdingPeriodText }) => {
    if (!results) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 min-h-full">
                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                    <Calculator className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Enter your transaction details to see the tax calculation</p>
                </div>
            </div>
        );
    }

    const gainOrLossStyles = {
        label: results.hasCapitalLoss ? 'Loss' : 'Gain',
        textColor: results.isNeutralGain ? 'text-slate-300' : results.hasCapitalLoss ? 'text-red-400' : 'text-green-400',
        bgColor: results.isNeutralGain ? 'bg-slate-500/20 border-slate-500/30' : results.hasCapitalLoss ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30',
    };

    const summaryText = results.getSummaryText();
    const shouldShowStatusBox = results.totalTaxPayable <= 0 && !results.calculationError;

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 min-h-full">
            <h2 className="text-2xl font-bold text-white mb-6">Tax Calculation Results</h2>
            <div className="space-y-4">
                
                {results.calculationError && (
                    <div className="p-4 text-center rounded-xl border bg-amber-500/10 border-amber-500/30">
                        <h3 className="text-xl font-bold text-amber-300 flex items-center justify-center gap-2">
                           <AlertCircle /> 
                           Calculation Incomplete
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">{results.calculationError}</p>
                    </div>
                )}

                {shouldShowStatusBox && (
                     <div className={`p-4 text-center rounded-xl border ${gainOrLossStyles.bgColor}`}>
                        <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                           <CheckCircle className={`${gainOrLossStyles.textColor}`}/> 
                           {results.isNeutralGain ? "No Gain / No Loss" : results.hasCapitalLoss ? "Capital Loss" : "Zero Tax Liability"}
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">{results.getZeroTaxReasonText()}</p>
                    </div>
                )}
                
                {summaryText && <p className="p-4 bg-slate-800/50 text-slate-300 rounded-xl text-center text-sm">{summaryText}</p>}
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4"><div className="text-sm text-slate-400">Total Purchase</div><div className="text-xl font-bold text-white">₹{results.formattedTotalPurchase}</div></div>
                    <div className="bg-white/10 rounded-xl p-4"><div className="text-sm text-slate-400">Total Sale</div><div className="text-xl font-bold text-white">₹{results.formattedTotalSale}</div></div>
                </div>

                {/* --- NEW: Comparison Box --- */}
                {results.isLongTerm && results.savedAmount > 0 && (
                    <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-center">
                        <p className="text-sm text-sky-300 flex items-center justify-center gap-2"><TrendingUp size={16}/> Smart Choice!</p>
                        <p className="text-slate-300 mt-1">
                            You saved <span className="font-bold text-white">₹{results.savedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span> in taxes with this option.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            (Tax with other option would have been ₹{results.comparisonTaxPayable.toLocaleString('en-IN', { maximumFractionDigits: 0 })})
                        </p>
                    </div>
                )}
                
                {/* This is the NEW version with the tooltip added */}
                <div className={`p-4 rounded-xl ${gainOrLossStyles.bgColor}`}>
                    <div className="text-sm text-slate-300">Net {gainOrLossStyles.label}</div>
                    <div className={`flex items-center text-2xl font-bold ${gainOrLossStyles.textColor}`}>
                        ₹{results.formattedNetGainOrLoss}

                        {/* This new block adds the Info icon and Tooltip ONLY for losses */}
                        {results.hasCapitalLoss && (
                            <div className="relative group ml-2">
                                <Info className="w-5 h-5 text-slate-400 cursor-pointer" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg bg-red-900/50 backdrop-blur-sm border border-red-500/30 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">

                                    {/* The new, easy-to-read vertical breakdown */}
                                    <div className="space-y-1 font-mono">
                                        <div className="flex justify-between">
                                            <span>Sale Value:</span>
                                            <span>₹{results.formattedTotalSale}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{results.isLossDueToIndexation ? 'Indexed Cost:' : 'Purchase Cost:'}</span>
                                            <span className="text-red-400">-₹{results.isLossDueToIndexation ? results.formattedIndexedCost : results.formattedTotalPurchase}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Expenses:</span>
                                                <span className="text-red-400">-₹{results.formattedExpenses}</span>
                                        </div>
                                    </div>

                                    <hr className="border-red-500/30 my-2" />

                                    <div className="flex justify-between font-mono font-bold">
                                        <span>Net Loss:</span>
                                        <span>-₹{results.formattedNetGainOrLoss}</span>
                                    </div>

                                    {/* The little triangle for the tooltip */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-red-900/50"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!results.hasCapitalLoss && !results.isNeutralGain && (
                    <div className="space-y-3 p-4 bg-slate-800/50 rounded-xl">
                        {/*
                           ==================================================
                           2. THIS IS THE UPDATED INDEXED COST SECTION
                           ==================================================
                        */}
                        {results.indexedCost > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-slate-300 flex items-center">
                                    Indexed Cost
                                    {/* The Info icon and tooltip will only show if all data is available */}
                                    {results.hasIndexationInfo && (
                                        <div className="relative group ml-2">
                                            <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-3 rounded-lg bg-slate-900 border border-slate-600 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                <p className="font-mono text-center">
                                                    {results.formattedTotalPurchase} &times; ({results.ciiSaleValue} / {results.ciiPurchaseValue})
                                                </p>
                                                <p className="text-slate-400 text-center text-[10px] mt-1">
                                                    (Original Cost &times; (CII of Sale Year {results.saleFY} / CII of Purchase Year {results.purchaseFY}))
                                                </p>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                                            </div>
                                        </div>
                                    )}
                                </span>
                                <span className="text-white font-semibold">₹{results.formattedIndexedCost}</span>
                            </div>
                        )}
                        {/* --- END OF UPDATED SECTION --- */}

                        <div className="flex items-center justify-between"><span className="text-slate-300">Holding Period</span><span className="text-white font-semibold">{holdingPeriodText} ({results.isLongTerm ? 'Long-term' : 'Short-term'})</span></div>
                        <div className="flex items-center justify-between"><span className="text-slate-300">Tax Type</span><span className="text-white font-semibold">{results.taxType}</span></div>
                        {results.exemption > 0 && (<div className="flex items-center justify-between"><span className="text-slate-300">LTCG Exemption</span><span className="text-green-400 font-semibold">- ₹{results.formattedExemption}</span></div>)}
                        <div className="flex items-center justify-between border-t border-slate-600 pt-3"><span className="text-slate-300">Taxable Gain</span><span className="text-white font-bold">₹{results.formattedTaxableGain}</span></div>
                    </div>
                )}
                
                {results.totalTaxPayable > 0 ? (
                    // This is the existing purple box for when tax is due
                    <div className="p-4 bg-purple-600/20 rounded-xl border border-purple-500/30">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center"><span className="text-slate-300">Base Tax @ {results.displayTaxRate}</span><span className="font-semibold text-white">₹{results.formattedBaseTax}</span></div>
                            <div className="flex justify-between items-center"><span className="text-slate-300">Health & Edu Cess @ 4%</span><span className="font-semibold text-white">+ ₹{results.formattedCess}</span></div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-purple-400/30 text-center">
                            <div className="text-sm text-slate-300 mb-1">Total Tax Payable</div>
                            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">₹{results.formattedTotalTaxPayable}</div>
                        </div>
                    </div>
                ) : results.isLossDueToIndexation ? (
                    // This is the NEW gray box to explicitly show a zero tax liability
                    <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                        <div className="text-center">
                            <div className="text-sm text-slate-300 mb-1">Total Tax Payable</div>
                            <div className="text-2xl font-bold text-slate-300">₹0</div>
                        </div>
                    </div>
                ) : null}

                <button onClick={() => getAiAdvice(results)} disabled={isAiLoading || !results} className="w-full flex items-center justify-center mt-4 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {isAiLoading ? 'Getting Advice...' : 'Ask AI Tax Advisor'}
                </button>
                
                {isAiLoading && ( <div className="text-center p-4 text-slate-400 flex items-center justify-center gap-2"><Sparkles className="w-5 h-5 animate-spin text-purple-400"/>Loading AI insights...</div> )}
                {aiError && ( <div className="text-center p-4 text-red-400 bg-red-500/10 rounded-lg flex items-center justify-center gap-2"><AlertCircle className="w-5 h-5"/>{aiError}</div> )}
                {aiInsight && (
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-800 via-sky-900/20 to-slate-800 border border-sky-500/30 space-y-4">
                        <div>
                            <h4 className="font-bold text-white mb-2 text-lg flex items-center"><BrainCircuit className="w-5 h-5 mr-2 text-sky-400"/>Calculation Breakdown</h4>
                            <p className="text-slate-300 text-sm">{aiInsight.breakdown}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-2 text-lg flex items-center"><Landmark className="w-5 h-5 mr-2 text-green-400"/>Relevant Tax-Saving Strategies</h4>
                            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                                {aiInsight.strategies.map((tip, index) => <li key={index}>{tip}</li>)}
                            </ul>
                        </div>
                        <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-700">AI can make mistakes. Please double-check important information.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsDisplay;