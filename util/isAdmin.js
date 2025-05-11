module.exports = (req, res, next) => {
    if(!req.session.isAuthenticated || !req.session.isAdmin){
        return res.redirect('/');
    }
    next();
}