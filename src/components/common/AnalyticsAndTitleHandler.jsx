import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

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

        // Step 3: Send the manual page_view event to Google Analytics.
        // This is the correct command for tracking virtual page views in an SPA.
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: title,
                page_location: window.location.href, // Sends the full URL
                page_path: path,                     // Sends just the path (e.g., /calculator/equity)
            });
        }

    }, [location]); // This effect runs on the initial load AND every time the URL changes.

    return null; // This component renders nothing to the screen
};

export default AnalyticsAndTitleHandler;