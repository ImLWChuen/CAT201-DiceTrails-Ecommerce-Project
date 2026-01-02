// Utility function to calculate final price after discount
export const calculateDiscountedPrice = (product) => {
    if (!product || !product.price) return 0;

    const discount = product.discount || 0;
    if (discount > 0 && discount <= 100) {
        return product.price * (1 - discount / 100);
    }

    return product.price;
};

// Utility function to get discount amount
export const getDiscountAmount = (product) => {
    if (!product || !product.price) return 0;

    const discount = product.discount || 0;
    if (discount > 0 && discount <= 100) {
        return product.price * (discount / 100);
    }

    return 0;
};
