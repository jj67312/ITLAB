module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send('You are not authorized to view this resource');
    }
}

module.exports.alreadyLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/forums');      
}
