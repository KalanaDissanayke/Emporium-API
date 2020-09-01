const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: [true, 'Please add a quantity'],
                },
                subTotal: {
                    type: Number,
                },
            },
        ],
        required: [true, 'Please add products for cart'],
        validate: (v) => Array.isArray(v) && v.length > 0,
    },
    status: {
        type: String,
        enum: ['INACTIVE', 'IN PROGRESS', 'COMPLETED'],
        default: 'IN PROGRESS',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Static method to update product stock and save
CartSchema.statics.updateProductStock = async function (productId, quantity, add) {
    try {
        const product = await this.model('Product').findById(productId);

        await this.model('Product').findByIdAndUpdate(productId, {
            stock: {
                ...product.stock,
                quantity: add ? product.stock.quantity + quantity : product.stock.quantity - quantity,
            },
        });
    } catch (err) {
        console.error(err);
    }
};

// Call updateProductStock after save
CartSchema.post('save', async function () {
    this.products.forEach(async (p) => {
        await this.constructor.updateProductStock(p.product, p.quantity, false);
    });
});

// Call updateProductStock before remove
CartSchema.post('remove', async function () {
    this.products.forEach(async (p) => {
        await this.constructor.updateProductStock(p.product, p.quantity, true);
    });
});

module.exports = mongoose.model('Cart', CartSchema);
