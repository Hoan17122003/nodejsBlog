const passport = require('passport');
const app = require('express')();
const passportJWT = require('passport-jwt');
const session = require('express-session');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

const { JWT_SECRET } = require('../../config/scret')//error import data
const { JWT_SECRET1 } = require('../../config/scret')// fix 
const User = require('../models/user');

app.use(passport.initialize());
app.use(passport.session({
    secret: JWT_SECRET1,
    resave: false,
    saveUninitialized: false,
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (userName, done) {
    User.findOne({ userName })
        .then(function (user) {
            done(null, user);
        }).catch(function (err) {
            console.log(err);
        })
});

// passport jwt
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET1,
},
    async (jwtPayload, done) => {
        try {
            console.log('payload: ', jwtPayload)
            const user = await User.findOne({ userName: jwtPayload.sub });
            console.log(user);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
// => nó sẽ bị lỗi unAuthorization và cách fix : thêm từ khóa Bearer + với token đc trả về từ server 
// passport-local

// hàm deserializeUser : đc gọi bởi passport.session giúp ta lấy dữ liệu user lưu thông tin trên session và gắn vào req.user
// hàm serializeUser : hàm đc gọi khi xác thực thành công để lưu thông tin user vào session





passport.use('local.signin', new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'passWord',
    passReqToCallback: false,
    session: true,
}
    ,
    async function (userName, passWord, done) {
        try {

            const user = await User.findOne({ userName: userName });

            if (!user) return done(null, false);

            const isCorrectPassword = await user.isValidPassword(passWord);

            if (!isCorrectPassword) return done(null, false);


            done(null, user);
        } catch (error) {
            console.log('error')
            done(error, false);
            // throw new Error(error);
        }


    }
))

// passport google 
passport.use(new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '606321069264-8uqbcb9bpg1k0161rphdd4418i21uh8k.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || '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',
},
    async (accessToken, refreshToken, profile, next) => {
        try {
            console.log(profile);
            // check whether this current user exists in out DB
            const user = await User.countDocuments({ authGoogleID: profile.id });
            if (user) {
                return next(null, user);
            }

            // if new acccount
            const newUser = new User({
                authType: 'google',
                userName: profile.name.familyName + ' ' + profile.name.givenName,
                email: profile.emails[0].value,
                authGoogleID: profile.id,
                avatar: profile.photos[0].value
            });
            await newUser.save();
            return next(null, newUser);
        } catch (error) {
            next(false, error);
        }
    }));

//passport facebook
passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID || '1097548888340355',
    clientSecret: process.env.FACEBOOK_SECRET || '05e8e7e4bb3e90b7ebba021846d8cc8e',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            // check whether this current user exists in out DB
            const user = await User.countDocuments({ authFacebookID: profile.id });
            if (user) {
                return done(null, user);
            }

            // if new acccount
            const newUser = new User({
                authType: 'facebook',
                userName: profile.name.familyName + ' ' + profile.name.givenName,
                email: 'undifined',
                authFaceBook: profile.id,
                avatar: profile.photos[0].value
            });
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            next(false, error);
        }
    }));


module.exports = passport;