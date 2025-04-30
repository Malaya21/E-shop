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
// Profile Route
router.get('/profile', (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/user/login');
    }
    res.render('profile', { user, messages: req.flash() });
});

// Update Profile Route
router.post('/profile/update', async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/user/login');
    }

    try {
        const { name, phone, currentPassword, newPassword, address } = req.body;
        const updateData = {
            name,
            phone,
            address: Array.isArray(address) ? address : [address]
        };

        // If new password is provided, verify current password and update
        if (newPassword) {
            const existingUser = await User.findById(user._id);
            if (existingUser.password !== currentPassword) {
                req.flash('error', 'Current password is incorrect');
                return res.redirect('/user/profile');
            }
            updateData.password = newPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            updateData,
            { new: true }
        );

        // Update session with new user data
        req.session.user = updatedUser;
        req.flash('success', 'Profile updated successfully');
        res.redirect('/user/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        req.flash('error', 'Error updating profile');
        res.redirect('/user/profile');
    }
});
router.post('/add-address', async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/user/login');
    }

    try {
        const { address } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $push: { address: address } },
            { new: true }
        );

        // Update session with new user data
        req.session.user = updatedUser;
        res.locals.address = updatedUser.address;
        req.flash('success', 'Address added successfully');
        res.redirect(req.get('referer'));
    } catch (error) {
        console.error('Error adding address:', error);
        req.flash('error', 'Error adding address');
        res.redirect(req.get('referer'));
    }
}
);

module.exports = router;
