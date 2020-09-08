const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: [true, 'Please add a transaction id'],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    currency: {
        type: String,
        required: [true, 'Please add an currency'],
        enum: ['LKR', 'USD'],
    },
    cart: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cart',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Change cart status to COMPLETED
OrderSchema.post('save', async function () {
    await this.model('Cart').findByIdAndUpdate(this.cart, {
        status: 'COMPLETED',
    });
});

module.exports = mongoose.model('Order', OrderSchema);
