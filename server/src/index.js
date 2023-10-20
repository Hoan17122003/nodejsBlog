// config env
require('dotenv').config();// dotevn not working how to fix ?
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan')
const session = require('express-session');
const handlebars = require('express-handlebars');
const { engine } = require('express-handlebars')
const hbs = require('hbs')
const cors = require('cors');
const { Server } = require('socket.io');

const io = new Server({
    cors : {
        origin : 'localhost:'
    }
})

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
    resave: true,
    saveUninitialized: true
}))

// can thiep vao url khac trong trang web 

app.use(cors());
// app.use(passport.session());

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json());

db.connect();

app.get('/testt', (req, res, next) => {
    console.log(req.session.user)
    res.send('')
})



route(app);
app.listen(port, () => {
    console.log('start server ...');
})