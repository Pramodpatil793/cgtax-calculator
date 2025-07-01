import { useState, useEffect } from 'react';

export const useDateValidation = (purchaseDate, saleDate, isGrandfathered, isPre2001Property) => {
    const [dateError, setDateError] = useState(null);
    const [holdingPeriodText, setHoldingPeriodText] = useState('');

    useEffect(() => {
        const start = purchaseDate ? new Date(purchaseDate) : null;
        const end = saleDate ? new Date(saleDate) : null;
        let error = null;

        // --- THIS IS THE NEW, RESTRUCTURED LOGIC ---

        // Part 1: Run checks that ONLY depend on the purchase date.
        // These will run immediately when a purchase date is selected.
        if (start) {
            if (isGrandfathered && start > new Date("2018-01-31")) {
                error = 'For grandfathering, purchase date must be on or before Jan 31, 2018.';
            } else if (isPre2001Property && start > new Date("2001-04-01")) {
                error = "When 'pre-2001' is checked, the purchase date cannot be after April 1, 2001.";
            }
        }

        // Part 2: Run checks that depend on BOTH dates, but only if no error has been found yet.
        if (!error && start && end) {
            if (end < start) {
                error = 'Sale date cannot be earlier than purchase date.';
            }
        }
        
        setDateError(error);

        // This logic for the holding period text remains the same.
        if (start && end && !error) {
            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            let days = end.getDate() - start.getDate();

            if (days < 0) {
                months--;
                days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }
            setHoldingPeriodText(`${years > 0 ? `${years}y ` : ''}${months > 0 ? `${months}m ` : ''}${days}d`);
        } else {
            setHoldingPeriodText('');
        }
    }, [purchaseDate, saleDate, isGrandfathered, isPre2001Property]);

    return { dateError, holdingPeriodText };
};