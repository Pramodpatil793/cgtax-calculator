import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'calculator'
    const [selectedAsset, setSelectedAsset] = useState(null); // e.g., 'equity', 'realestate'

    // When view changes back to dashboard, reset the selected asset
    useEffect(() => {
        if (currentView === 'dashboard') {
            setSelectedAsset(null);
        }
    }, [currentView]);

    const value = {
        currentView,
        setCurrentView,
        selectedAsset,
        setSelectedAsset,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};