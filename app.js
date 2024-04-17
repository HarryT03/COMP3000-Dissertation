const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;
const passport = require('passport');
require('./server/config/passport-config')(passport);

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

const userRoutes = require('./server/routes/userRoutes');
app.use('/user', userRoutes);

function ensureAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
      return next();
    } else {
      req.flash('error_msg', 'Please log in to view this resource');
      res.redirect('/user/login');
    }
  }

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    next();
  });

const routes = require('./server/routes/recipeRoutes.js')
app.use('/', ensureAuthenticated, routes)

app.get('/user/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/user/login');
      }
    });
  });

app.listen(port, ()=> console.log(`Listening to port ${port}`));