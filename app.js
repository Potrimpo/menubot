'use strict';

const express = require('express'),
  crypto = require('crypto'),
  path = require('path'),
  passport = require('passport');

// Starting express server & redis & postgres
const app = express(),
  http = require('http').createServer(app),
  io = require('socket.io')(http),
  expressConfig = require('./express-config'),
  { sequelize } = require('./database/models/index');

expressConfig(app, express);

// socket.io listeners
const init = require('./socket-functions');
init(io);

// API keys and Passport configuration.
const secrets = require('./config/secrets'),
  passportConf = require('./config/passport');

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

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    // console.log(`signature: ${signature}`);
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', process.env.FB_APP_SECRET || envVar.FB_APP_SECRET)
      .update(buf)
      .digest('hex');

    if (signatureHash != expectedHash) {
      console.log(`signatureHash: ${signatureHash}`);
      console.log(`expectedHash: ${expectedHash}`);
      console.log(`app secret: ${process.env.FB_APP_SECRET || envVar.FB_APP_SECRET}`);
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

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
