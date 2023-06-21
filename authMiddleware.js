module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send('You are not authorized to view this resource');
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/forums');
    } else {
        req.flash('error_msg', 'Incorrect credentials')
        res.redirect('/login');
    }
}