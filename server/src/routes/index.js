const siteRouter = require('./site.routes');
const authenticationRouter = require('./authenticattion.routes')
const pageRouter = require('./page.routes');

function route(app) {
    app.use('/authentication',authenticationRouter)
    app.use('/news',pageRouter);
    app.use('/',siteRouter);
}
module.exports = route

// module.exports = route = function(app) {
    
    
//     app.use(siteRouter);
// }