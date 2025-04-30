const express = require("express");
const router = express.Router();

const Cart = require("../models/cart");
const Product = require("../models/product");
router.get("/", async (req, res) => {
  console.log("cart item is here");
  const userId = req.session.user._id;
  if (!userId) {
    return res.redirect("/user/login");
  }
  try {
    const cartData = await Cart.findOne({ userId }).populate(
      "products.productId"
    );
    if (!cartData) {
      return res.render("cart", { cart: null });
    }
    
   
    res.render("cart", { cart: cartData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Add to cart
router.post("/", async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.body.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Cart doesn't exist, create a new cart
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            quantity: 1,
            price: product.price,
          },
        ],
        totalAmount: product.price,
      });
    } else {
      // Cart exists, check if product already exists
      const existingProductIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (existingProductIndex >= 0) {
        // Product already in cart -> increase quantity

        const existingProduct = cart.products[existingProductIndex];

        // Check stock availability
        if (existingProduct.quantity + 1 > product.stock) {
          // Assuming product.stock is available
          req.flash("error", "Cannot add more. Stock limit reached.");
          return res.redirect("/cart");
        }

        existingProduct.quantity += 1;
        cart.totalAmount += product.price;
      } else {
        // New product, push into cart
        cart.products.push({
          productId,
          quantity: 1,
          price: product.price,
        });
        cart.totalAmount += product.price;
      }
    }

    await cart.save();
    req.flash("success", "Product added to cart successfully!");
    res.redirect(req.get("referer"));
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/increase/:id", async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.params.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      req.flash("error", "Cart not found");
      return res.status(404).redirect("/cart");
    }
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) {
      req.flash("error", "Product not found in cart");
      return res.status(404).redirect("/cart");
    }
    const product = cart.products[productIndex];
    const productDetails = await Product.findById(productId);
    if (!productDetails) {
      req.flash("error", "Product not found");
      return res.status(404).redirect("/cart");
    }
    // Check stock availability
    if (product.quantity + 1 > productDetails.stock) {
      
    
      req.flash("error", "Cannot add more. Stock limit reached.");
      return res.redirect("/cart");
    }
    // Increase quantity and total amount
    product.quantity += 1;
    product.price = parseFloat((product.quantity * productDetails.price).toFixed(2)); // Update price based on quantity
    cart.totalAmount += productDetails.price;
    // Fix to 2 decimal places
    product.price = parseFloat((product.quantity * productDetails.price).toFixed(2));
    cart.totalAmount = parseFloat(cart.totalAmount.toFixed(2));
    await cart.save();
    req.flash("success", "Product quantity increased successfully!");
    res.redirect("/cart");
  } catch (error) {
    req.flash("error", "Error increasing quantity: " + error.message);
    res.status(500).redirect("/");
  }
});

// Remove product from cart
router.post("/decrease/:id", async (req, res) => {
    const userId = req.session.user._id;
    const productId = req.params.id;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            req.flash("error", "Cart not found");
            return res.status(404).redirect("/cart");
        }
        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );
        if (productIndex === -1) {
            req.flash("error", "Product not found in cart");
            return res.status(404).redirect("/cart");
        }
        const product = cart.products[productIndex];
        const productDetails = await Product.findById(productId);
        if (!productDetails) {
            req.flash("error", "Product not found");
            return res.status(404).redirect("/cart");
        }
        // Only check if quantity is 1 once
        if (product.quantity === 1) {  
            req.flash("error", "Item cannot be less than 1. Remove it from cart.");
            return res.redirect("/cart");
        }
        // Decrease quantity and total amount
        product.quantity -= 1;
        product.price = parseFloat((product.quantity * productDetails.price).toFixed(2)); // Update price based on quantity
        cart.totalAmount -= productDetails.price;
        cart.totalAmount = parseFloat(cart.totalAmount.toFixed(2)); // Fix to 2 decimal places
        await cart.save();
        req.flash("success", "Product quantity decreased successfully!");
        res.redirect("/cart");
    } catch (error) {
        req.flash("error", "Error decreasing quantity: " + error.message);
        res.status(500).redirect("/");
    }
});
router.post("/remove/:id", async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.params.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      req.flash("error", "Cart not found");
      return res.status(404).redirect("/cart");
    }
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) {
      req.flash("error", "Product not found in cart");
      return res.status(404).redirect("/cart");
    }
    const product = cart.products[productIndex];
    const productDetails = await Product.findById(productId);
    if (!productDetails) {
      req.flash("error", "Product not found");
      return res.status(404).redirect("/cart");
    }
    // Remove product from cart and update total amount
    cart.products.splice(productIndex, 1); // Remove product from array
    cart.totalAmount -= productDetails.price * product.quantity; // Update total amount
    cart.totalAmount = parseFloat(cart.totalAmount.toFixed(2)); // Fix to 2 decimal places
    await cart.save();
    req.flash("success", "Product removed from cart successfully!");
    res.redirect("/cart");
    } catch (error) {
        req.flash("error", "Error removing product: " + error.message);
        res.status(500).redirect("/cart");
    }
});

module.exports = router;
