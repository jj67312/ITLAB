module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.render('auth.ejs');
    }
}

module.exports.alreadyLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/forums');      
}
