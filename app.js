'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  crypto = require('crypto'),
  // var toobusy = require('toobusy-js');
  cookieParser = require('cookie-parser'),
  compress = require('compression'),
  session = require('express-session'),
  pgSession = require('connect-pg-simple')(session),
  logger = require('morgan'),
  errorHandler = require('errorhandler'),
  lusca = require('lusca'),
  methodOverride = require('method-override'),
  ejsEngine = require('ejs-mate'),
  flash = require('express-flash'),
  path = require('path'),
  passport = require('passport'),
  expressValidator = require('express-validator');


const { sequelize } = require('./database/models/index'),
  messengerMiddleware = require('./controllers/messengerMiddleware');

// API keys and Passport configuration.
const secrets = require('./config/secrets'),
  envVar = require('./envVariables'),
  passportConf = require('./config/passport');

// Starting express server and socket.io
const app = express(),
  http = require('http').createServer(app),
  io = require('socket.io')(http);

app.use(({method, url}, rsp, next) => {
  rsp.on('finish', () => {
    console.log(`${rsp.statusCode} ${method} ${url}`);
  });
  next();
});
app.use(bodyParser.json({ verify: verifyRequestSignature }));
// app.use('/static', express.static(__dirname + 'public'));

app.use(express.static(path.join(__dirname, 'dist'), { maxAge: 31557600000 }));

// Express configuration.
app.engine('ejs', ejsEngine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable("trust proxy");
app.use(compress());
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());

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
app.use(flash());
// app.use(lusca({
//   csrf: true,
//   xframe: 'SAMEORIGIN',
//   xssProtection: true
// }));
// app.use(lusca.csrf({
//   cookie: 'X-CSRF-TOKEN'
// }));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.gaCode = secrets.googleAnalyticsCode;
  next();
});
// app.use(function(req, res, next) {
//   console.log("COOKIE ====", req.cookies["X-CSRF-TOKEN"]);
//   console.log("LOCALS ===", res.locals._csrf);
//   res.cookie('X-CSRF-TOKEN', res.locals._csrf, {httpOnly: false});
//   next();
// });

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
app.route('/contact')
  .get(contactController.getContact)
  .post(contactController.postContact);
app.get('/account', passportConf.isAuthenticated, passportConf.isAuthorized, facebookController.getFacebook);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get('/orders/:fbid', passportConf.isAuthenticated, passportConf.isAuthorized, homeController.orders);

app.use('/api', passportConf.isAuthenticated, passportConf.isAuthorized, apiController);

app.use('/company', passportConf.isAuthenticated, passportConf.isAuthorized, companyController);

// OAuth authentication routes. (Sign in)
app.get('/auth/facebook', passport.authenticate('facebook', secrets.facebook.authOptions));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/landing', failureFlash: true })
);

// Privacy policy route
app.get('/priv', homeController.priv);

// Error Handler.
app.use(errorHandler());

// Avoid not responsing when server load is huge
// app.use(function(req, res, next) {
//   if (toobusy()) {
//     res.status(503).send("I'm busy right now, sorry. Please try again later.");
//   } else {
//     next();
//   }
// });

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

io.on('connection', function (socket) {
  console.log("     socket.io connection!");
  socket.on('request-orders', function (fbid) {
    return ordersController.fetchOrders(fbid)
      .then(orders => socket.emit('orders-list', orders))
      .catch(err => console.error("error in socket business", err));
  });
});

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
