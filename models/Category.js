const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Category:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *            description: Name for the category, needs to be unique.
 *          createdAt:
 *             type: string
 *             format: date-time
 */

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name can not be more than 50 characters'],
        },
        slug: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        id: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// Create category slug from the name
CategorySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Cascade delete products when a category is deleted
CategorySchema.pre('remove', async function (next) {
    await this.model('Product').deleteMany({ category: this._id });
    next();
});

// Reverse populate with Virtuals
CategorySchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category',
    justOne: false,
});

module.exports = mongoose.model('Category', CategorySchema);
