const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist");
const { isLogin } = require("../middleware/isLogin");

// Get user's wishlist
router.get("/", isLogin, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      userId: req.session.user._id,
    }).populate("products.productId");
    if (!wishlist) {
        req.flash("error", "No items in your wishlist.");
        return res.redirect("/products");
        }

    res.render("wishlist", { wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    req.flash("error", "Error loading wishlist");
    res.redirect("/");
  }
});

// Add product to wishlist
router.get("/add/:id", isLogin, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.session.user._id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create new wishlist if it doesn't exist
      wishlist = new Wishlist({
        userId,
        products: [{ productId }],
      });
    } else {
      // Check if product already exists in wishlist
      const productExists = wishlist.products.some(
        (product) => product.productId.toString() === productId
      );

      if (!productExists) {
        wishlist.products.push({ productId });
      }
    }

    await wishlist.save();
    res.redirect(req.get("referer"));
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to add to wishlist" });
  }
});

// Remove product from wishlist
router.get("/remove/:id", isLogin, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.session.user._id;

    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      // Remove the product from the wishlist
      wishlist.products = wishlist.products.filter(
        (product) => product.productId.toString() !== productId
      );

      // If no products left, delete the wishlist
      if (wishlist.products.length === 0) {
        await Wishlist.deleteOne({ userId });
      } else {
        await wishlist.save();
      }
    }

    res.redirect("/wishlist");
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to remove from wishlist" });
  }
});

module.exports = router;
