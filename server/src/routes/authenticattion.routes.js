const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/AuthenticationController')
const passportMiddleware = require('../app/middleware/Passport.Middleware');
const passportConfig = require('../app/middleware/Passport.Middleware')

router.get('/signup', authController.signupGet)
router.post('/signup', authController.signgupPost)
router.get('/login', authController.login)
router.post('/checklogin', authController.loginPost)
router.post('/logout', authController.logout)
router.post('/auth/google', passportMiddleware.authenticate('google-plus-token', { session: false }), authController.AuthGoogle)
router.post('/auth/facebook', passportMiddleware.authenticate('facebook-token', { session: false }),authController.AuthFaceBook )
// router.post('/checklogin', passportMiddleware.authenticate('local.signin', {
//     session: false,
//     successRedirect: '/news',
//     failureMessage: 'failed in signin'
// }), authController.signin);

router.get('/secret', passportMiddleware.authenticate('jwt', { session: true }), authController.secret)




module.exports = router;
