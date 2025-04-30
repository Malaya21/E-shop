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
router.get('/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        if(!product){
            req.flash('error','Product not found')
            return res.redirect('/products')
        }
        const relatedProducts = await Product.find({ category: product.category }).limit(8);
        res.render('product-details',{product, relatedProducts})
    } catch (error) {
        console.error(error)
        req.flash('error','Internal Server Error')
        res.redirect('/products')
    }

    
})

module.exports = router;
    







