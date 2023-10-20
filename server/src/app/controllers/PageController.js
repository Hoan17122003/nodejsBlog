const Page = require('../models/Page');
const User = require('../models/user')
const { multipleMongooseToObject, mongooseToObject } = require('../../ulti/mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');



const { JWT_SECRET1 } = require('../../config/scret')


const author = (user) => ({
    name: user.name,
    avatar: user.avatar,
    email: user.email,
    level: user.level,
    chuyenNganh: user.chuyenNganh,
    gender: user.gender
});

class PageController {

    // [POST]: /Blog/create
    async postCreate(req, res, next) {

        const page = new Page(req.body);
        // set flag mỗi bài viết bởi Id của user 
        const token = req.session.token;
        const accessToken = await jwt.verify(token.accessToken, JWT_SECRET1);
        const user = await User.findOne({ userName: accessToken.username });

        page.save()
            .then((savePage) => {
                console.log('changePage : ', change);
                let pagesTemp = user.pages;
                pagesTemp.push(savePage[0]._id);
                console.log('pagesTemp: ', pagesTemp);
                user.updateOne({ pages: pagesTemp }, { new: true })
                    .then(changeA => {
                        console.log('change : ', changeA);
                    })
            })
            .catch(err => {
                console.log('err', err);
            })
        res.redirect('/news');
    }
    //[GET]: /blog/create
    getCreate(req, res, next) {
        res.render('./pages/page')
    }

    //[GET]: news
    async news(req, res, next) {


        let result = [];
        const userALL = await User.find({}).populate('pages').exec(); // Lấy thông tin chi tiết về các bài đăng
        // const pageALL = userALL.pages().sort('title', 1).project({ __v: 0, slug: '' });
        // console.log('count : ', pageALL.count());
        console.log(userALL);
        return res.render('./pages/news', {
            checkToken: req.session.token,
        });
    }
}

module.exports = new PageController;