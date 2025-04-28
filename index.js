require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db');
const ejsMate = require('ejs-mate')
const path = require('path');
const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');
const productsRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const {isLogin,isAdmin} = require('./middleware/isLogin');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{      
        httpOnly: true, 
    }
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Add middleware to make user info available to all routes
app.use((req, res, next) => {
    res.locals.name = req.session.user ? req.session.user.name : "Guest";
    res.locals.role = req.session.user ? req.session.user.role : 'Guest';
    next();
});

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

app.use('/', homeRoutes);
app.use('/admin', isLogin,isAdmin, adminRoutes);
app.use('/products', productsRoutes);
app.use('/user', userRoutes);
app.use('/cart', isLogin, cartRoutes);
app.use('/wishlist', isLogin, wishlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



