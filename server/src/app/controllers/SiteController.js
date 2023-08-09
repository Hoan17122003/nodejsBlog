const user = require('../models/user');

class SiteController {

    //[GET]:/
    home(req,res,next) {
        console.log(req.session.user);
        res.render('home')
    }
    //[GET]: /
    loginHome(req,res,next) {
        if(req.session.user) {
            res.json({result:req.session.user})
        }
        res.status(401).json({message:'dont request home page'})
    }
}

module.exports = new SiteController;