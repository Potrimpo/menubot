'use strict';

module.exports = {

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  googleAnalyticsCode: process.env.GOOGLE_ANALYTICS_CODE || null,

  // used in passport verification
  facebook: {
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true,
    enableProof: true,
    profileFields: ['accounts', 'first_name', 'last_name'],
    authOptions: { scope: ['manage_pages', 'pages_messaging'] }
  }
};
