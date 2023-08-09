const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan')
const session = require('express-session');
const handlebars = require('express-handlebars');
const {engine} = require('express-handlebars')
const hbs = require('hbs')


const port = process.env.PORT || 8080;
const db = require('../src/config/db/mongodb1')
const route = require('./routes/index')

app.use(express.static(path.join(__dirname, 'public')));


app.use(morgan('combined'));
// app.engine('hbs',
// //  handlebars({
// //     extname: '.hbs',
// //     // helpers: {
// //     //     sum: (a, b) => a + b
// //     // }
// // })
// engine()
// );
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'resources/views'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'loginUser',
    resave: false,
    saveUninitialized: true
}))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());





db.connect();
route(app);
app.listen(port, () => {
    console.log('start server ...');
})