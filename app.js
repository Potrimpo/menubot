'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  crypto = require('crypto'),
  // var toobusy = require('toobusy-js');
  cookieParser = require('cookie-parser'),
  compress = require('compression'),
  favicon = require('serve-favicon'),
  session = require('express-session'),
  pgSession = require('connect-pg-simple')(session),
  logger = require('morgan'),
  errorHandler = require('errorhandler'),
  lusca = require('lusca'),
  methodOverride = require('method-override'),
  multer = require('multer'),
  ejsEngine = require('ejs-mate'),
  flash = require('express-flash'),
  path = require('path'),
  passport = require('passport'),
  expressValidator = require('express-validator'),
  connectAssets = require('connect-assets');


const { sequelize } = require('./database/models/index'),
  messengerMiddleware = require('./controllers/messengerMiddleware');

// API keys and Passport configuration.
const secrets = require('./config/secrets'),
  { PORT, FB_APP_SECRET, sessionTable, postgresURL } = require('./envVariables'),
  passportConf = require('./config/passport');

// console.log(`/webhook is accepting Verify Token: "${FB_VERIFY_TOKEN}"`);

// Starting our webserver and putting it all together
const app = express();
app.use(({method, url}, rsp, next) => {
  rsp.on('finish', () => {
    console.log(`${rsp.statusCode} ${method} ${url}`);
  });
  next();
});
app.use(bodyParser.json({ verify: verifyRequestSignature }));
// app.use('/static', express.static(__dirname + 'public'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// Express configuration.
app.engine('ejs', ejsEngine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable("trust proxy");
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: path.join(__dirname, 'uploads') }).single());
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());

//PostgreSQL Store
app.use(session({
  store: new pgSession({
    conString: postgresURL,
    tableName: sessionTable
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

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.gaCode = secrets.googleAnalyticsCode;
  next();
});
app.use(function(req, res, next) {
  res.cookie('XSRF-TOKEN', res.locals._csrf, {httpOnly: false});
  next();
});

// Webhook GET (facebook pings this with heartbeat)
app.get('/webhook', messengerMiddleware.getWebhook);

// Message handler
app.post('/webhook', messengerMiddleware.postWebhook);

// Controllers (route handlers).
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');


// Primary app routes.
app.get('/', homeController.index);
app.get('/landing', homeController.landing);
// app.get('/login', userController.getLogin);
app.get('/logout', userController.logout);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

// OAuth authentication routes. (Sign in)
app.get('/auth/facebook', passport.authenticate('facebook', secrets.facebook.authOptions));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/landing', failureFlash: true }) );

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

    var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      console.log(`signatureHash: ${signatureHash}`);
      console.log(`expectedHash: ${expectedHash}`);
      throw new Error("Couldn't validate the request signature.");
    }
  }
}


sequelize.sync({ force: false })
  .then(() => {
    console.log("sequelize is synced");
    app.listen(PORT);
    console.log('Listening on :' + PORT + '...');
  })
  .catch(err => console.error("error syncing sequelize db", err.message || err));


module.exports = app;
