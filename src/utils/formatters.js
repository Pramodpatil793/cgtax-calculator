export const formatIndianCurrency = (numStr) => {
    if (!numStr) return '';
    const [integerPart, decimalPart] = numStr.toString().split('.');
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);

    if (otherNumbers !== '') {
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        return `${formattedOtherNumbers},${lastThree}${decimalPart ? '.' + decimalPart : ''}`;
    }
    return `${lastThree}${decimalPart ? '.' + decimalPart : ''}`;
};

export const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return 'Select Date';
    const date = new Date(dateStr);
    // Adjust for timezone offset to prevent date changes
    const utcDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    return utcDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};