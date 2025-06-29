import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const MEASUREMENT_ID = "G-0N6Z3L0SB6"; // <-- REPLACE THIS

const AnalyticsAndTitleHandler = () => {
    const location = useLocation();

    useEffect(() => {
        // Step 1: Determine the correct page title based on the current URL
        let title = "CGTax Calculator"; // Default title
        let path = location.pathname;

        if (path === '/') {
            title = "Dashboard | CGTax Calculator";
        } else if (path === '/calculator') {
            title = "Select Asset | CGTax Calculator";
        } else if (matchPath("/calculator/:assetId", path)) {
            const match = matchPath("/calculator/:assetId", path);
            const assetName = match.params.assetId.charAt(0).toUpperCase() + match.params.assetId.slice(1);
            title = `${assetName} Calculator | CGTax Calculator`;
        }
        
        // Step 2: Update the document's title
        document.title = title;

        // Step 3: Send the event to Google Analytics with the correct title and path
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: title,
                page_location: window.location.href,
                page_path: path,
            });
        }

    }, [location]); // This effect runs every time the location object changes

    return null; // This component renders nothing to the screen
};

export default AnalyticsAndTitleHandler;