'use strict';

const express = require('express'),
  crypto = require('crypto'),
  session = require('express-session'),
  pgSession = require('connect-pg-simple')(session),
  path = require('path'),
  passport = require('passport');

// API keys and Passport configuration.
const secrets = require('./config/secrets'),
  passportConf = require('./config/passport');

// Database, express setup code,
const { sequelize } = require('./database/models/index'),
  expressConfig = require('./express-config');

// Initialising express app
const app = express();

expressConfig(app, express);

// postgres sessions for users on the site
app.use(session({
  store: new pgSession({
    conString: `postgres://postgres:${process.env.postgresPassword}@${process.env.postgresURL}:5432/menubot`,
    tableName: process.env.sessionTable
  }),
  secret: secrets.sessionSecret,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true
    //, secure: true // only when on HTTPS
  }
}));

// Controllers (route handlers).
const homeController = require('./controllers/home'),
  userController = require('./controllers/user'),
  apiController = require('./controllers/api'),
  facebookController = require('./controllers/facebook'),
  companyController = require('./controllers/company'),
  contactController = require('./controllers/contact'),
  messengerMiddleware = require('./controllers/messengerMiddleware');

// WEBHOOK HANDLERS MUST COME BEFORE SECURITY CHECKS (that we are no longer using lmao)
// Webhook GET (facebook pings this with heartbeat)
app.route('/webhook')
  .get(messengerMiddleware.getWebhook)
  .post(messengerMiddleware.postWebhook);

app.use(passport.initialize());
app.use(passport.session());

// Primary app routes.
app.get('/', passportConf.isAuthenticated, passportConf.isAuthorized, homeController.index);
app.get('/landing', homeController.landing);
app.get('/logout', userController.logout);
app.get('/contact', contactController.getContact);
app.get('/account', passportConf.isAuthenticated, passportConf.isAuthorized, facebookController.getFacebook);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get('/orders/:fbid', passportConf.isAuthenticated, passportConf.isAuthorized, homeController.orders);
app.get('/priv', homeController.priv);


// API router used for asynchronous actions like fetching photos from Facebook
app.use('/api', passportConf.isAuthenticated, passportConf.isAuthorized, apiController);

// Router for dealing with company creation & updates, including menu changes
app.use('/company', passportConf.isAuthenticated, passportConf.isAuthorized, companyController);

// OAuth authentication routes. (Sign in)
app.get('/auth/facebook', passport.authenticate('facebook', secrets.facebook.authOptions));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/landing', failureFlash: true })
);

// syncing with postgres database, then assigning ports & IP to the server
sequelize.sync({ force: false })
  .then(() => {
    console.log("sequelize is synced");
    app.listen(process.env.PORT, process.env.serverIP);
    console.log('Listening on :' + process.env.PORT + '...');
  })
  .catch(err => {
    console.log("postgresURL =", process.env.postgresURL);
    console.error("error syncing sequelize db", err)
  });


module.exports = app;
