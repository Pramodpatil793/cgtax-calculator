import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const PageTitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        let title = "CGTax Calculator"; // Default title

        // Match the path to determine the correct title
        if (location.pathname === '/') {
            title = "Dashboard | CGTax Calculator";
        } else if (location.pathname === '/calculator') {
            title = "Select Asset | CGTax Calculator";
        } else if (matchPath("/calculator/:assetId", location.pathname)) {
            // For specific calculators, capitalize the asset ID for the title
            const match = matchPath("/calculator/:assetId", location.pathname);
            const assetName = match.params.assetId.charAt(0).toUpperCase() + match.params.assetId.slice(1);
            title = `${assetName} Calculator | CGTax Calculator`;
        }
        
        // Set the document's title
        document.title = title;

    }, [location]); // This effect runs every time the URL changes

    return null; // This component renders nothing to the screen
};

export default PageTitleUpdater;