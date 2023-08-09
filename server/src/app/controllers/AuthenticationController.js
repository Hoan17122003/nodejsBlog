const user = require('../models/user');



class AuthenticationController {

    //[GET]/login (render)
    async login(req, res, next) {
        res.render('./authentication/login');
    }
    //[POST]/login (handle)
    async checkLogin(req, res, next) {
        const { userName, passWord } = req.body;
        const userMember = await user.findOne({ userName: userName, passWord: passWord });
        userMember
            .then(data => data.json())
            .then(data => {
                console.log(data)
            }) 
        if (!userMember) {
            res.status(401).json({ "message ": 'invalueid creandtail' })
        }
        res.json({user:userMember});
        // req.session.user = userMember;
        // res.redirect('/')
    }

}

module.exports = new AuthenticationController;