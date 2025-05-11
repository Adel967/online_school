const { render } = require("ejs")

exports.get404 = (req, res, next) => {
    res.render('404');
}