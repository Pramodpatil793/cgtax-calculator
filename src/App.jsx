import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './features/dashboard/Dashboard';
import CalculatorView from './features/calculator/CalculatorView';
import AnalyticsReporter from './components/common/AnalyticsReporter'; // Import the new component


const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function App() {
    return (
        <AppProvider>
            <div className='dark bg-slate-900'>
                <Navbar />
                <ScrollToTop />
                <AnalyticsReporter />
                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/calculator/*" element={<CalculatorView />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </AppProvider>
    );
}

export default App;