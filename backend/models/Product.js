const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: String,
    rating: Number,
    comment: String
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand : {
        type: String
    },
    sizes: {
        type: [String],
        required: true
    },
    colors: {
        type: [String],
        required: true
    },
    collections: {
        type: String,
        required: true
    },
    material: {
        type: String
    },
    gender: {
        type: String,
        enum: ["Men", "Women", "Unisex"]
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            altText: {
                type: String,
            }
        }
    ],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isFPublished: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    tags:  [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    metaKeywords: {
        type: String
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    weight: Number,
},
{timestamps: true}
);

module.exports = mongoose.model("Product", productSchema)