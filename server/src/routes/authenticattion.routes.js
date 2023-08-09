const authentication = require('../app/controllers/AuthenticationController');
const express = require('express');
const router = express.Router();


router.get('/checklogin',authentication.checkLogin)
router.get('/',function(req,res,next) {
    console.log('hi');
    next();
}, authentication.login)


module.exports = router;
