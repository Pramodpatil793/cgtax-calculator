import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AnalyticsAndTitleHandler = () => {
    const location = useLocation();

    useEffect(() => {
        // --- Defaults ---
        let title = "CGTax Calculator | Free Capital Gains Tax Calculator for India";
        let description = "Calculate your capital gains tax accurately with our free online tools for assets like equity, real estate, and more. India's most comprehensive tax calculator for FY 2024-25.";
        let structuredData = null;
        
        const path = location.pathname;

        // --- Page-Specific SEO Data ---
        if (path === '/') {
            title = "Dashboard | CGTax Calculator";
            description = "An overview of capital gains tax rules in India and access to our free, easy-to-use tax calculators for equity, property, and mutual funds.";
            structuredData = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "CGTax Calculator",
                "url": "https://www.cgtax.in/",
            };
        } else if (path === '/calculator') {
            title = "Select Asset | CGTax Calculator";
            description = "Choose an asset to calculate your capital gains tax in India. We offer free calculators for equity, real estate, mutual funds, and more.";
        } else if (matchPath("/calculator/:assetId", path)) {
            const match = matchPath("/calculator/:assetId", path);
            const assetName = match.params.assetId.charAt(0).toUpperCase() + match.params.assetId.slice(1);
            title = `${assetName} Calculator | CGTax Calculator`;
            description = `Calculate capital gains tax for ${assetName} in India. Our free tool helps you with indexation and accurate tax reporting for FY 2024-25.`;
            structuredData = {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": `${assetName} Capital Gains Calculator`,
                "applicationCategory": "FinancialApplication",
                "operatingSystem": "Any (Web Application)",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "INR"
                }
            };
        }
        
        // --- Send page_view event to Google Analytics ---
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: title,
                page_location: window.location.href,
                page_path: path,
            });
        }
    }, [location]);

    // --- Render SEO tags to the document's <head> ---
    // Note: This part is now outside the useEffect hook.
    // We re-calculate the SEO tags on every render to pass them to Helmet.
    
    let title = "CGTax Calculator | Free Capital Gains Tax Calculator for India";
    let description = "Calculate your capital gains tax accurately with our free online tools for assets like equity, real estate, and more. India's most comprehensive tax calculator for FY 2024-25.";
    let structuredData = null;
    const path = location.pathname;

    if (path === '/') {
        title = "Dashboard | CGTax Calculator";
        description = "An overview of capital gains tax rules in India and access to our free, easy-to-use tax calculators for equity, property, and mutual funds.";
        structuredData = { "@context": "https://schema.org", "@type": "WebSite", "name": "CGTax Calculator", "url": "https://www.cgtax.in/" };
    } else if (path === '/calculator') {
        title = "Select Asset | CGTax Calculator";
        description = "Choose an asset to calculate your capital gains tax in India. We offer free calculators for equity, real estate, mutual funds, and more.";
    } else if (matchPath("/calculator/:assetId", path)) {
        const match = matchPath("/calculator/:assetId", path);
        const assetName = match.params.assetId.charAt(0).toUpperCase() + match.params.assetId.slice(1);
        title = `${assetName} Calculator | CGTax Calculator`;
        description = `Calculate capital gains tax for ${assetName} in India. Our free tool helps you with indexation and accurate tax reporting for FY 2024-25.`;
        structuredData = { "@context": "https://schema.org", "@type": "SoftwareApplication", "name": `${assetName} Capital Gains Calculator`, "applicationCategory": "FinancialApplication", "operatingSystem": "Any (Web Application)", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" } };
    }
    
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default AnalyticsAndTitleHandler;