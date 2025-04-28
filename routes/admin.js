const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

router.get("/", async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  res.render("admin/admin", { totalProducts, totalOrders, totalUsers });
});

router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.render("admin/products", { products });
});
router.get("/products/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/editProduct", { product });
});

router.get("/orders", async (req, res) => {
  const orders = await Order.find().populate('products').populate('userId');
  res.render("admin/orders", { orders });
});

router.get('/users', async (req, res) => {
  const users = await User.find();
  res.render("admin/users", { users });
});
router.delete("/products", async (req, res) => {
  const { productId } = req.body;
  await Product.findByIdAndDelete(productId);
  res.redirect("/admin/products");
});

router.get("/products/add", (req, res) => {
  res.render("admin/addProduct");
});
router.patch("/products/edit/:id", async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  const productId = req.params.id;
  await Product.findByIdAndUpdate(productId, {
    name,
    description,
    price,
    category,
    stock,
    image,
  });
  res.redirect("/admin/products");
});
router.post("/products/add", async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  const newProduct = new Product({
    name,
    description,
    price,
    category,
    stock,
    image,
  });
  await newProduct.save();
  res.redirect("/admin");
});

module.exports = router;
