const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();


// ✅ GET ALL PRODUCTS
router.get('/', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// 🔥 ADD PRODUCT (IMPORTANT)
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            countInStock,
            sku,
            category,
            sizes,
            colors,
            collections,
            images
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            countInStock,
            sku,
            category,
            sizes,
            colors,
            collections,
            images: images || [{ url: "https://via.placeholder.com/150" }],
            user: req.user._id
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;