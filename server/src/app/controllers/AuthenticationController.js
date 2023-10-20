const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookie = require('cookie-parser');
const randToken = require('rand-token');

const User = require('../models/user');
const Courses = require('../models/Course');
const { multipleMongooseToObject } = require('../../ulti/mongoose')
const { JWT_SECRET1 } = require('../../config/scret')
const authMethod = require('../methods/index');



const encondedToken = (userName) => {
    return jwt.sign({
        iat: new Date().getTime(),
        iss: 'Hà Đức Hoàn',
        sub: userName,
        exp: new Date().setDate(new Date().getDate() + 3)
    }, JWT_SECRET1)
}
class AuthenticationController {

    //[GET]: authentication/login 
    async login(req, res, next) {
        res.render('./authentication/login');
    }

    secret(req, res, next) {
        console.log('called to secret function',)
    }

    //[POST]:authentication/auth/google
    async AuthGoogle(req, res, next) {
        const token = encondedToken(req.user.userName);
        res.setHeader('Authorization', token);
        return res.status(200).json({ message: 'success' })
    }
    async AuthFaceBook(req, res, next) {
        console.log('user login with FaceBook : ', req.user);
        res.json({ message: 'success ' });
    }

    //[POST]:authentication/login
    async loginPost(req, res, next) {
        try {
            let { passWord, userName } = req.body;
            const user = await User.findOne({ userName });
            let flag;
            await user.isValidPassword(passWord)
                .then(resultCheck => {
                    flag = resultCheck;
                })
            if (!user) {
                return res.status(401).json({ message: 'sai tài khoản' });
            }
            if (!flag) {
                return res.status(401).json({ message: 'sai mật khẩu' });
            }
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '10m';
            const accessTokenScret = process.env.ACCESS_TOKEN_SECRET || JWT_SECRET1;
            const dataForAccessToken = {
                username: user.userName,
            };
            const accessToken = jwt.sign(dataForAccessToken, accessTokenScret, { algorithm: 'HS256', expiresIn: accessTokenLife });
            if (!accessToken) {
                return res.status(401).send('đăng nhập không thành công, vui lòng thử lại');
            }
            let refreshToken = randToken.generate(16);
            if (!user.refreshToken || user.refreshToken == 'undefined') {
                await user.updateOne({ refreshToken }, { new: true })
            } else {
                refreshToken = user.refreshToken;
            }
            const token = {
                accessToken,
                refreshToken,
            };
            req.session.token = token;
            return res.redirect('/news');
            // return res.redirect('/news');
        } catch (error) {
            console.log('error: ', error)
            // return res.status(500).json({ error: 'Error logging in' });
        }
    }

    //[POST]: authentcation/logout
    async logout(req, res, next) {
        if (!req.message == 'logout') {
            res.redirect('/news');
        }
        const refreshToken = req.session.token.refreshToken;
        console.log('refreshToken: ', refreshToken)
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: 'undefined' }, { new: true })
            .then(data => {
                console.log('success: ', data);
            })
            .catch(err => {
                console.log('error: ', err);
            })
        res.session = null;
        res.redirect('/');
    }


    //[POST] test : authentiction/checklogin
    signin(req, res, next) {
        console.log('called to my func');
        res.status(300).json({ user: req.session.user });
    }

    //[GET]: authentication/signup
    signupGet(req, res, next) {
        res.render('authentication/signup')
    }

    //[POST]: authentication/signup
    async signgupPost(req, res, next) {
        try {
            const user = new User(req.body);
            const checkUserName = await User.findOne({ userName: user.userName });
            if (checkUserName) {
                return res.status(500).json({ err: 'userName is lived' });
            }
            await user.save();
            const token = encondedToken(user.userName);
            console.log('payload:', jwt.verify(token, JWT_SECRET1))
            res.setHeader('Authorization', token);
            return res.json({ message: 'sucessfully' })
        } catch (error) {
            return res.status(500).json({ err: 'error creating user' });
        }
    }

}

module.exports = new AuthenticationController();
exports = {
    encondedToken,
}