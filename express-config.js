/**
 * Created by lewis.knoxstreader on 23/11/16.
 */
const cookieParser = require('cookie-parser'),
  path = require('path'),
  session = require('express-session'),
  pgSession = require('connect-pg-simple')(session),
  flash = require('express-flash'),
  // lusca = require('lusca'),
  // toobusy = require('toobusy-js'),
  compress = require('compression'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  errorHandler = require('errorhandler'),
  methodOverride = require('method-override'),
  ejsEngine = require('ejs-mate'),
  expressValidator = require('express-validator');

const secrets = require('./config/secrets'),
  devVar = require('./config/local-dev-variables');

module.exports = function (app, express) {

  app.use(express.static(path.join(__dirname, 'dist'), { maxAge: 31557600000 }));

  // Express configuration.
  app.engine('ejs', ejsEngine);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.enable("trust proxy");
  app.use(compress());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressValidator());
  app.use(methodOverride());
  app.use(cookieParser());

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

app.use(bodyParser.json({ verify: verifyRequestSignature }));

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  const signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    // console.log(`signature: ${signature}`);
    const elements = signature.split('='),
      method = elements[0],
      signatureHash = elements[1];

    const expectedHash = crypto.createHmac('sha1', process.env.FB_APP_SECRET || devVar.FB_APP_SECRET)
      .update(buf)
      .digest('hex');

    if (signatureHash != expectedHash) {
      console.log(`signatureHash: ${signatureHash}`);
      console.log(`expectedHash: ${expectedHash}`);
      console.log(`app secret: ${process.env.FB_APP_SECRET || devVar.FB_APP_SECRET}`);
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

};
