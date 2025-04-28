function isLogin(req, res, next) {
  if (req.session.user) {
    console.log('User is logged in:', req.session.user);
    
    return next();
  }
  res.redirect('/login');
}
