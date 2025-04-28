const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/login', (req, res) => {
    
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup',{error:null});
});

router.post('/signup', (req, res) => {
    const {firstName,lastName,email,password,phone} = req.body;
    userName = firstName+' '+lastName; 
    const newUser = new User({
        name: userName,
        email: email,
        password: password,
        phone: phone,
        address: [],
    });
    newUser.save()
        .then(() => {
            res.redirect('/user/login');
        })
        .catch((err) => {
            console.error(err);
           
            res.status(500).render('signup',{error: 'Error creating user: ' + err.message});
        });
        req.session.user = newUser; // Store user in session

});
// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDetails = await User.findOne({ email, password });

    if (userDetails) {
        req.session.user = userDetails;
        req.session.save(() => {
            req.flash('success', 'Login successful!');
            
            if (req.session.goToUrl) {
                console.log('Redirecting to:', req.session.goToUrl);
                
                const redirectUrl = req.session.goToUrl;
                req.session.goToUrl = null; // Clear the redirect URL after using it
                return res.redirect(redirectUrl);
            }
            res.redirect('/');
        });
    } else {
        req.flash('error', 'Invalid email or password');
        res.redirect('/user/login');
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Logout error');
        }
        res.clearCookie('connect.sid');
       res.redirect('/')
    });
});

module.exports = router;
