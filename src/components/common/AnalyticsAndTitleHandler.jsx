import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const MEASUREMENT_ID = "G-YOUR_MEASUREMENT_ID"; // <-- REPLACE THIS

const AnalyticsAndTitleHandler = () => {
    const location = useLocation();

    useEffect(() => {
        // Step 1: Determine the correct page title based on the current URL
        let title = "CGTax Calculator";
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
            // This line has been corrected to use the MEASUREMENT_ID variable
            window.gtag('config', MEASUREMENT_ID, {
                page_title: title,
                page_path: path,
            });
        }

    }, [location]);

    return null;
};

export default AnalyticsAndTitleHandler;