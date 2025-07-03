import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import { ASSET_TYPES_ARRAY } from '../../config/assetConfig';
import AssetCard from './components/AssetCard';
import AssetCalculatorPage from './AssetCalculatorPage'; // Import our new component

// CalculatorView is now a "Layout Route" that contains its own routes.
const CalculatorView = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/60 to-slate-900 text-white pt-20 pb-8"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                    {/* Route 1: The "index" route for "/calculator" */}
                    {/* This shows the asset selection grid. */}
                    <Route index element={
                        <>
                            <div className="relative text-center mb-12 md:h-12">
                                <Link to="/" className="text-purple-400 hover:text-purple-300 text-lg flex items-center mx-auto mb-4 md:mb-0 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2">
                                    ← Back to Dashboard
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Capital Gains Tax Calculator</h1>
                                    <p className="text-lg text-slate-300 font-medium mt-2">Select an asset type to start</p>
                                </div>
                            </div>
                            <div id="asset-selection" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ASSET_TYPES_ARRAY.map((asset) => (
                                    <AssetCard key={asset.id} asset={asset} />
                                ))}
                            </div>
                        </>
                    } />

                    {/* Route 2: The dynamic route for "/calculator/:assetId" */}
                    {/* This renders our new AssetCalculatorPage component. */}
                    <Route path=":assetId" element={<AssetCalculatorPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default CalculatorView;