function isLogin(req, res, next) {
  if (req.session.user) {
    
    return next();
  }
  req.flash('error', 'You must log in first!');
  req.session.goToUrl = req.originalUrl;
  res.redirect('/user/login');
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'You do not have permission to access this page!');
  res.redirect('/');
}

module.exports = { isLogin, isAdmin };
