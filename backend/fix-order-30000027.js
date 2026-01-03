const fs = require('fs');

// Read the orders.json file
const ordersData = JSON.parse(fs.readFileSync('orders.json', 'utf-8'));

// Find order #30000027
const targetOrder = ordersData.find(order => order.orderId === '30000027');

if (targetOrder) {
    console.log('Found order #30000027:');
    console.log(JSON.stringify(targetOrder, null, 2));

    // Check if newsletter discount should be applied
    console.log('\n--- Analysis ---');
    console.log('Total Amount:', targetOrder.totalAmount);
    console.log('Shipping Fee:', targetOrder.shippingFee);
    console.log('Newsletter Discount Applied:', targetOrder.newsletterDiscountApplied);

    // Calculate subtotal from items
    let subtotal = 0;
    if (targetOrder.items) {
        for (const item of targetOrder.items) {
            const itemPrice = item.discount && item.discount > 0
                ? item.price * (1 - item.discount / 100)
                : item.price;
            subtotal += itemPrice * item.quantity;
        }
    }

    console.log('Calculated Subtotal:', subtotal);
    console.log('Expected Total (no discount):', subtotal + (targetOrder.shippingFee || 0));
    console.log('Actual Total:', targetOrder.totalAmount);

    const difference = (subtotal + (targetOrder.shippingFee || 0)) - targetOrder.totalAmount;
    console.log('Difference (potential discount):', difference);

    // If difference is significant and newsletterDiscountApplied is false, update it
    if (difference > 1 && !targetOrder.newsletterDiscountApplied) {
        console.log('\nℹ️  Detected newsletter discount was applied but flag is false!');
        console.log('Updating newsletterDiscountApplied to true...');

        targetOrder.newsletterDiscountApplied = true;

        // Save the updated orders
        fs.writeFileSync('orders.json', JSON.stringify(ordersData, null, 2));
        console.log('✅ Order updated successfully!');
    } else {
        console.log('\nNo update needed.');
    }
} else {
    console.log('Order #30000027 not found!');
}
