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



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

app.use('/', homeRoutes);
app.use('/admin', adminRoutes);
app.use('/products', productsRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



