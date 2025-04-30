const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");

router.get("/", async (req, res) => {
    const userId = req.session.user._id;
    if (!userId) {
        req.flash("error", "Please login to view your Orders.");
        return res.redirect("/user/login");
    }
    try {
        const orders = await Order.find({ userId })
            .populate("products.productId")
            .sort({ createdAt: -1 });
        if (!orders) {
            req.flash("error", "No orders found.");
            return res.redirect("/orders", { orders: null });
        }
        const phone = req.session.user.phone;
        res.render("order", { orders, phone });
    } catch (error) {
        console.error(error);
        req.flash("error", "Internal Server Error.");
        res.redirect("/orders");
    }
    })
    // place order
router.post("/", async (req, res) => {
    const userId = req.session.user._id;
    const { address, paymentMethod} = req.body;
    if (!userId) {
        req.flash("error", "Please login to place an order.");
        return res.redirect("/user/login");
    }
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.products.length === 0) {
            req.flash("error", "Your cart is empty.");
            return res.redirect("/cart");
        }
        const totalAmount = cart.totalAmount;
        const order = new Order({
            userId,
            products: cart.products,
            totalAmount,
            paymentMode: paymentMethod,
            address: address,

        });
        cart.products.forEach(async (item) => {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        });
        await order.save();
        await Cart.deleteOne({ userId });
        req.flash("success", "Order placed successfully.");
        res.redirect("/orders");
    } catch (error) {
        console.error(error);
        req.flash("error", "Internal Server Error.");
        res.redirect("/cart");
    }
});
router.post('/cancel', async (req, res) => {
    const userId = req.session.user._id;
    if (!userId) {
        req.flash("error", "Please login to cancel an order.");
        return res.redirect("/user/login");
    }
    try {
        const orderId = req.body.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            req.flash("error", "Order not found.");
            return res.redirect("/orders");
        }
        if (order.userId.toString() !== userId) {
            req.flash("error", "You are not authorized to cancel this order.");
            return res.redirect("/orders");
        }
        // Restore stock for each product in the order
        for (const item of order.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }
        // Update the order status to cancelled
        await Order.findByIdAndUpdate({ _id: orderId }, { $set: { status: 'cancelled' } });
        req.flash("success", "Order cancelled successfully.");
        res.redirect("/orders");
    } catch (error) {
        console.error(error);
        req.flash("error", "Internal Server Error.");
        res.redirect("/orders");
    }
}
);
router.post('/delete', async (req, res) => {
    const userId = req.session.user._id;
    if (!userId) {
        req.flash("error", "Please login to delete an order.");
        return res.redirect("/user/login");
    }
    try {
        const orderId = req.body.orderId;
        const order = await
    Order.findById(orderId);
        if (!order) {
            req.flash("error", "Order not found.");
            return res.redirect("/orders");
        }
        if (order.userId.toString() !== userId) {
            req.flash("error", "You are not authorized to delete this order.");
            return res.redirect("/orders");
        }
        // Delete the order
        await Order.findByIdAndDelete(orderId);
        req.flash("success", "Order deleted successfully.");
        res.redirect("/orders");
    } catch (error) {
        console.error(error);
        req.flash("error", "Internal Server Error.");
        res.redirect("/orders");
    }
}
);
router.get("/payment", async(req, res) => {
    const userId = req.session.user._id;
    const address = req.session.user.address;
    const cart = await Cart.findOne({ userId}); 
    const totalAmount = cart.totalAmount;
    if (!userId) {
        req.flash("error", "Please login to view your Orders.");
        return res.redirect("/user/login");
    }
    
    
    
    res.render("demopayment", {  address, totalAmount });
});

module.exports = router;
