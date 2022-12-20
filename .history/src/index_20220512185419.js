const express = require('express');
var handlebars = require('express-handlebars');
const app = express();
const path = require('path');
const port = 3000 || process.env.PORT;
const bodyParser = require('body-parser');
const route = require('./routes');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const http = require('http');
const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server);
//Run when client connects
io.on('connect', socket => {
    socket.on('on-chat', data => {
        io.emit('user-chat', data);
    });
})

//Passport config
require('./middlewares/passport-authen')(passport);

// Enviroment variables
const dotenv = require('dotenv');
dotenv.config();

//Connect database
const connect = require('./config/database/connection');
connect.connect();

//Middlewares
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

//Express-session
app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    name: 'Customer',
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash messages middleware
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use((req, res, next) => {
    res.locals.message1 = req.session.message1;
    delete req.session.message1;
    next();
});

app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})

//Template handlebars
var hbs = handlebars.create({
    extname: 'hbs'
});

hbs.handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.handlebars.registerHelper('ifNotCond', function(v1, v2, options) {
    if (v1 != v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});


hbs.handlebars.registerHelper('ifTest', function(v1, options) {
    switch (v1) {
        case "info":
            return '<span class="badge badge-info">' + "Chờ xác nhận" + '</span>';
        case "success":
            return '<span class="badge badge-warning">' + "Chờ lấy hàng" + '</span>';
        case "prepare":
            return '<span class="badge badge-info">' + "Chờ giao hàng" + '</span>';
        case "shipping":
            return '<span class="badge badge-primary">' + "Đang giao" + '</span>';
        case "done":
            return '<span class="badge badge-success">' + "Giao thành công" + '</span>';
        case "danger":
            return '<span class="badge badge-secondary">' + "Đã huỷ" + '</span>';
    }
});

hbs.handlebars.registerHelper('ifPromo', function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, 'resources', 'views'));

route(app)

app.listen(3000 || process.env.PORT, "0.0.0.0", () => {
    console.log(`app listen at ${port}`)
})