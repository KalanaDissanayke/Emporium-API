const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Product:
 *        type: object
 *        required:
 *          - name
 *          - description
 *          - unitPrice
 *        properties:
 *          name:
 *            type: string
 *            description: Name for the product, needs to be unique.
 *          description:
 *            type: string
 *            description: Description of the product.
 *          unitPrice:
 *              type: number
 *          stock:
 *             $ref: '#/components/schemas/Stock'
 *          averageRating:
 *              type: number
 *          photo:
 *              type: string
 *          createdAt:
 *              type: string
 *              format: date-time
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      Stock:
 *        type: object
 *        required:
 *          - quantity
 *          - unitOfMeasure
 *        properties:
 *          quantity:
 *            type: number
 *          unitOfMeasure:
 *            type: string
 *            description: Stock keeping measurement unit of a product.
 *            enum:
 *              - Box
 *              - Gram
 *              - Piece
 *              - Kilo
 *              - Liter
 *              - Pack
 */

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters'],
    },
    unitPrice: {
        type: Number,
        required: [true, 'Please add an unit price'],
    },
    stock: {
        quantity: {
            type: Number,
            required: [true, 'Please add a product quantity'],
        },
        unitOfMeasure: {
            type: String,
            required: [true, 'Please add an unit of measure'],
            enum: ['Box', 'Gram', 'Piece', 'Kilo', 'Liter', 'Pack'],
        },
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10'],
    },
    photo: {
        type: String,
        default: 'no-photo.jpg',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create product slug from the name
ProductSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
