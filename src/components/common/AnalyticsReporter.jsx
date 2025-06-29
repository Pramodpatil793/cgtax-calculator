import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MEASUREMENT_ID = "G-0N6Z3L0SB6"; // <-- REPLACE THIS

const AnalyticsReporter = () => {
    const location = useLocation();

    useEffect(() => {
        // This function sends a "page_view" event to Google Analytics
        // every time the user navigates to a new URL.
        if (window.gtag) {
            window.gtag('config', MEASUREMENT_ID, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]); // The effect runs every time the location object changes

    return null; // This component renders nothing to the screen
};

export default AnalyticsReporter;