/**
 * Format price with currency and consistent decimal places
 * @param {number|string} price - The price to format
 * @param {string} currency - Currency symbol (default: 'RM')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'RM') => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return `${currency} 0.00`;
    return `${currency} ${numPrice.toFixed(2)}`;
};
