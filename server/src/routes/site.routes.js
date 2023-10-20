const router = require('express').Router();
const siteController = require('../app/controllers/SiteController');
// const Authentication = require('../app/controllers/AuthenticationController');


router.get('/', siteController.home)

module.exports = router