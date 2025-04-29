const express = require("express");
const router = express.Router();

const Cart =require("../models/cart");
const Product = require("../models/product");
router.get("/", async (req, res) => {
  console.log("cart item is here");
  const userId = req.session.user._id; 
    if (!userId) {
        return res.redirect("/user/login");
        }
   try {
    const cartData =  await Cart.findOne({ userId }).populate("products.productId");
    if (!cartData) {
        return res.render("cart", { cart: null });
    }
    res.render("cart", { cart: cartData }); 
   } catch (error) {
    
        console.error(error);
        res.status(500).send('Internal Server Error');
   }

    
});


// Add to cart
router.post('/', async (req, res) => {
    const userId = req.session.user._id;
    const productId = req.body.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Cart doesn't exist, create a new cart
            cart = new Cart({
                userId,
                products: [{
                    productId,
                    quantity: 1,
                    price: product.price
                }],
                totalAmount: product.price
            });
        } else {
            // Cart exists, check if product already exists
            const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (existingProductIndex >= 0) {
                // Product already in cart -> increase quantity

                const existingProduct = cart.products[existingProductIndex];

                // Check stock availability
                if (existingProduct.quantity + 1 > product.stock) { // Assuming product.stock is available
                    req.flash('error', 'Cannot add more. Stock limit reached.');
                    return res.redirect('/cart');
                }

                existingProduct.quantity += 1;
                cart.totalAmount += product.price;
            } else {
                // New product, push into cart
                cart.products.push({
                    productId,
                    quantity: 1,
                    price: product.price
                });
                cart.totalAmount += product.price;
            }
        }

        await cart.save();
        req.flash('success', 'Product added to cart successfully!');
      res.redirect(req.get('referer')); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
