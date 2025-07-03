import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const AnalyticsAndTitleHandler = () => {
    const location = useLocation();

    // The analytics part remains the same
    useEffect(() => {
        const path = location.pathname;
        let title = "CGTax Calculator | Free Capital Gains Tax Calculator for India";

        if (path === '/') {
            title = "Dashboard | CGTax Calculator";
        } else if (path === '/calculator') {
            title = "Select Asset | CGTax Calculator";
        } else if (matchPath("/calculator/:assetId", path)) {
            const match = matchPath("/calculator/:assetId", path);
            const assetName = match.params.assetId.charAt(0).toUpperCase() + match.params.assetId.slice(1);
            title = `${assetName} Calculator | CGTax Calculator`;
        }

        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: title,
                page_location: window.location.href,
                page_path: path,
            });
        }
    }, [location]);


    // This part now uses React 19's built-in tags
    const path = location.pathname;
    let title = "CGTax Calculator | Free Capital Gains Tax Calculator for India";
    let description = "Calculate your capital gains tax accurately with our free online tools for assets like equity, real estate, and more. India's most comprehensive tax calculator for FY 2024-25.";
    let structuredData = null;

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
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </>
    );
};

export default AnalyticsAndTitleHandler;