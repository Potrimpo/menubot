'use strict';

const express = require('express'),
  crypto = require('crypto'),
  session = require('express-session'),
  pgSession = require('connect-pg-simple')(session),
  path = require('path'),
  passport = require('passport');


const { sequelize } = require('./database/models/index'),
  messengerMiddleware = require('./controllers/messengerMiddleware'),
  expressConfig = require('./express-config');

// API keys and Passport configuration.
const secrets = require('./config/secrets'),
  passportConf = require('./config/passport');

// Starting our webserver and putting it all together
const app = express();

expressConfig(app, express);

//PostgreSQL Store
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

// WEBHOOK HANDLERS MUST COME BEFORE SECURITY CHECKS (LUSCA)
// Webhook GET (facebook pings this with heartbeat)
app.route('/webhook')
  .get(messengerMiddleware.getWebhook)
  .post(messengerMiddleware.postWebhook);

app.use(passport.initialize());
app.use(passport.session());
// Controllers (route handlers).
const homeController = require('./controllers/home'),
  userController = require('./controllers/user'),
  apiController = require('./controllers/api'),
  facebookController = require('./controllers/facebook'),
  companyController = require('./controllers/company'),
  contactController = require('./controllers/contact'),
  ordersController = require('./controllers/orders');


// Primary app routes.
app.get('/', passportConf.isAuthenticated, passportConf.isAuthorized, homeController.index);
app.get('/landing', homeController.landing);
app.get('/logout', userController.logout);
app.route('/contact').get(contactController.getContact);
app.get('/account', passportConf.isAuthenticated, passportConf.isAuthorized, facebookController.getFacebook);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get('/orders/:fbid', passportConf.isAuthenticated, passportConf.isAuthorized, homeController.orders);

app.use('/api', passportConf.isAuthenticated, passportConf.isAuthorized, apiController);

app.use('/company', passportConf.isAuthenticated, passportConf.isAuthorized, companyController);

// OAuth authentication routes. (Sign in)
app.get('/auth/facebook', passport.authenticate('facebook', secrets.facebook.authOptions));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/landing', failureFlash: true }) );

// Privacy policy route
app.get('/priv', homeController.priv);

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
