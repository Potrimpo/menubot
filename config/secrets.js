const devVar = (process.env.NODE_ENV == 'development') ? require('./local-dev-variables') : null;

module.exports = {

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  googleAnalyticsCode: process.env.GOOGLE_ANALYTICS_CODE || null,

  // used in passport verification
  facebook: {
    clientID: process.env.FACEBOOK_ID || devVar.FACEBOOK_ID,
    clientSecret: process.env.FB_APP_SECRET || devVar.FB_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true,
    enableProof: true,
    profileFields: ['accounts', 'first_name', 'last_name'],
    authOptions: { scope: ['manage_pages', 'pages_messaging'] }
  }
};
