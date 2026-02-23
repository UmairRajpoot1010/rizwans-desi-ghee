const mongoose = require('mongoose');

// Mock Product model for testing
const FIXED_PRICES = { '500g': 1500, '1kg': 3000, '2kg': 6000 };

function getPriceForSize(size, variants = []) {
    if (!size) return null;

    const normalizedRequestedSize = size.replace(/\s/g, '').toLowerCase();

    if (!variants || variants.length === 0) {
        return FIXED_PRICES[normalizedRequestedSize] || null;
    }

    const variant = variants.find((v) => v.size.replace(/\s/g, '').toLowerCase() === normalizedRequestedSize);
    return variant ? variant.price : null;
}

// Test cases
const tests = [
    { size: '500g', variants: [], expected: 1500 },
    { size: '500 g', variants: [], expected: 1500 },
    { size: '1 KG', variants: [], expected: 3000 },
    { size: '500 g', variants: [{ size: '500 g', price: 1550 }], expected: 1550 },
    { size: '500g', variants: [{ size: '500 g', price: 1550 }], expected: 1550 },
    { size: '2kg', variants: [], expected: 6000 },
    { size: 'unknown', variants: [], expected: null },
];

let allPassed = true;
tests.forEach((t, i) => {
    const result = getPriceForSize(t.size, t.variants);
    if (result === t.expected) {
        console.log(`Test ${i + 1} PASSED (${t.size})`);
    } else {
        console.error(`Test ${i + 1} FAILED! Size: "${t.size}", Expected: ${t.expected}, Got: ${result}`);
        allPassed = false;
    }
});

if (allPassed) {
    console.log('\n✅ All normalization tests PASSED!');
} else {
    console.log('\n❌ Some tests FAILED.');
    process.exit(1);
}
