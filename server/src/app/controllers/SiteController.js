const User = require('../models/user');

class SiteController {

    //[GET]:/
    home(req,res,next) {
        if(req.session.user) {
            next();
        }
        res.render('home')
    }
}

module.exports = new SiteController;