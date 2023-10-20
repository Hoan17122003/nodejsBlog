const router = require('express').Router();
const pageController = require('../app/controllers/PageController');
const authMiddleware = require('../app/middleware/Auth.Middleware');


router.get('/blog/create', pageController.getCreate)
router.post('/blog/create', pageController.postCreate)
router.get('/', authMiddleware.checkToken, pageController.news);

module.exports = router;