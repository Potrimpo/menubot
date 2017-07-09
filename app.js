'use strict';

const express = require('express'),
  crypto = require('crypto'),
  path = require('path'),
  passport = require('passport');

// Starting express server & redis & postgres
const app = express(),
  http = require('http').createServer(app),
  io = require('socket.io')(http),
  { sequelize } = require('./database/models/index'),
  expressConfig = require('./express-config');

expressConfig(app, express);

// socket.io listeners
const init = require('./state-and-sessions/socket-functions');
init(io);

// API keys and Passport configuration.
const secrets = require('./config/secrets'),
  passportConf = require('./config/passport');

// Controllers (route handlers).
const homeController = require('./controllers/home'),
  userController = require('./controllers/user'),
  apiController = require('./controllers/api'),
  companyController = require('./controllers/company'),
  testController = require('./controllers/test'),
  contactController = require('./controllers/contact'),
  messengerMiddleware = require('./controllers/messengerMiddleware');

// WEBHOOK HANDLERS MUST COME BEFORE SECURITY CHECKS (that we are no longer using lmao)
// Webhook GET (facebook pings this with heartbeat)
app.route('/webhook')
  .get(messengerMiddleware.getWebhook)
  .post(messengerMiddleware.postWebhook);

// Primary app routes.
app.get('/', passportConf.isAuthenticated, passportConf.isAuthorized, homeController.index);
app.get('/landing', homeController.landing);
app.post('/login', homeController.login);
// app.post('/login', userController.validKey, homeController.login);
app.get('/logout', userController.logout);
app.get('/contact', contactController.getContact);
// app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get('/orders/:fbid', passportConf.isAuthenticated, passportConf.isAuthorized, homeController.orders);
app.get('/priv', homeController.priv);

// API router used for asynchronous actions like fetching photos from Facebook
app.use('/api', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.router);

// Router for dealing with  menu changes
app.use('/config', passportConf.isAuthenticated, passportConf.isAuthorized, testController);

// OAuth authentication routes. (Sign in)
app.get('/auth/facebook', passport.authenticate('facebook', secrets.facebook.authOptions));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/landing', failureFlash: true })
);
//For company creation & updates
app.use('/company', passportConf.isAuthenticated, passportConf.isAuthorized, companyController)

// curl to this in order to add new codes for new companies
app.post('/newCodeVerySecret', userController.newCode);

// syncing with postgres database, then assigning ports & IP to the server
sequelize.sync({ force: false })
  .then(() => {
    console.log("sequelize is synced");
    http.listen(process.env.PORT, process.env.serverIP);
    console.log(`Listening on :${process.env.PORT} at address ${process.env.serverIP}`);
  })
  .catch(err => {
    console.log("postgresURL =", process.env.postgresURL);
    console.error("error syncing sequelize db", err)
  });

module.exports = app;
