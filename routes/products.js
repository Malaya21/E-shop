const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async(req, res) => {
    const { category } = req.query;
  
    try {
        if(category){
            const products = await Product.find({category: category});
            res.render('products', { products });
        }else{
            const products = await Product.find();
            res.render('products', { products });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
    







