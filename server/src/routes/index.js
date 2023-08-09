const siteRouter = require('./site.routes');
const authenticationRouter = require('./authenticattion.routes')


function route(app) {
    app.use('/login',authenticationRouter)
    app.use('/',siteRouter);
}
module.exports = route

// module.exports = route = function(app) {
    
    
//     app.use(siteRouter);
// }