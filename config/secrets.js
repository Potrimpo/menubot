'use strict';

module.exports = {

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  googleAnalyticsCode: process.env.GOOGLE_ANALYTICS_CODE || null,

  // used in passport verification
  facebook: {
    clientID: process.env.FACEBOOK_ID || '1016842041753695',
    clientSecret: process.env.FACEBOOK_SECRET || '8d52435598ca3a63e4960a4b55aa0b30',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true,
    enableProof: true,
    profileFields: ['accounts', 'first_name', 'last_name'],
    authOptions: { scope: ['manage_pages', 'pages_messaging'] }
  }
};
