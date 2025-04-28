const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});


router.get('/cart', (req, res) => {
    res.render('cart', {
        cartItems: [
            {
                _id: '1',
                name: 'Smart TV',
                description: '4K Ultra HD Smart TV with HDR',
                price: 999.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f'
            },
            {
                _id: '2',
                name: 'Sofa Set',
                description: 'Modern 3-Piece Living Room Set',
                price: 799.99,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1445205170230-053b83016050'
            }
        ]
    });
});
router.get('/orders', (req, res) => {
    res.render('orders');
});


module.exports = router;

