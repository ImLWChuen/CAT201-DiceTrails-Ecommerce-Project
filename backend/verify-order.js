const fs = require('fs');

// Read the orders.json file
const ordersData = JSON.parse(fs.readFileSync('orders.json', 'utf-8'));

// Find and display order #30000027 with context
const targetIndex = ordersData.findIndex(order => order.orderId === '30000027');

if (targetIndex !== -1) {
    const order = ordersData[targetIndex];
    console.log('=== ORDER #30000027 ===');
    console.log('Position in array:', targetIndex);
    console.log('Order ID:', order.orderId);
    console.log('User ID:', order.userId);
    console.log('Total Amount:', order.totalAmount);
    console.log('Shipping Fee:', order.shippingFee);
    console.log('Newsletter Discount Applied:', order.newsletterDiscountApplied);
    console.log('Voucher Code:', order.voucherCode || 'None');
    console.log('\n=== VERIFYING FILE CONTENT ===');

    // Read the raw file and search for the order
    const rawContent = fs.readFileSync('orders.json', 'utf-8');
    const orderStart = rawContent.indexOf('"orderId": "30000027"');

    if (orderStart > -1) {
        // Extract ~500 characters around the order ID
        const snippet = rawContent.substring(Math.max(0, orderStart - 100), orderStart + 800);
        console.log('\nRaw JSON snippet:');
        console.log(snippet);
    }
} else {
    console.log('Order #30000027 not found!');
}
