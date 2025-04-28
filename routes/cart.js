const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");

router.get("/", (req, res) => {
  console.log("cart item is here");
  const userId = req.session.user._id; 
    if (!userId) {
        return res.redirect("/user/login");
        }
    Cart.findOne({ userId: userId })
      .populate("products.productId")
      .then(cart => {
        console.log(cart);
        res.json(cart);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Server Error");
      });

    
});
router.post('/', async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.user._id; 
    if (!userId) {
        return res.redirect("/user/login");
    }
    const newCartItem = new Cart({      
        userId: userId,
        products: [
            {
                productId: productId,
                
            }
        ],
        totalAmount: 0,
    });
   const data = await newCartItem.save()
    console.log(data);
    res.redirect('/cart');

});

module.exports = router;
