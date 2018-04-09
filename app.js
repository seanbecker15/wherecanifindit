const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const override = require('method-override');
const http = require('http');
const app = express();
const engines = require('consolidate');

app.use(logger('dev'));
// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Passport authentication
app.use(session({saveUninitialized: true, resave: true, secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Allows us to use '_method=<method>' to specify put, delete, etc.
app.use(override('_method'));

// Access public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Allows for embedded Javascript
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Models
// const models = require('./server/models');

// Routes
require('./server/routes/index.js')(app, passport)

// Passport strategies
require('./server/config/passport.js')(passport)

app.get('*', (req, res) => res.status(404).send({
    message: 'Page not found...',
}));

// Passport strategies
// require('./server/config/passport.js')(passport, models.User);

const port = process.env.PORT || 8081;
const server = http.createServer(app);
server.listen(port);

