const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public')); //public folder to shorten paths
app.use(expressLayouts);

app.use(cookieParser('CookITSecure'));
app.use(session({
    secret: 'CookITSecretSession',
    saveUninitialized: true,
    resave: true
}))
app.use(flash());
app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/recipeRoutes.js')
app.use('/', routes)

app.listen(port, ()=> console.log(`Listening to port ${port}`));