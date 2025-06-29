import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './features/dashboard/Dashboard';
import CalculatorView from './features/calculator/CalculatorView';

// Import our new and existing helper components
import ScrollToTop from './components/common/ScrollToTop';
import AnalyticsReporter from './components/common/AnalyticsReporter';
import PageTitleUpdater from './components/common/PageTitleUpdater';

function App() {
    return (
        <AppProvider>
            <div className='dark bg-slate-900'>
                <Navbar />
                
                {/* All helper components go here */}
                <ScrollToTop />
                <AnalyticsReporter />
                <PageTitleUpdater />
                
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