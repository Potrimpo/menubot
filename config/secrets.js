'use strict';
const { FACEBOOK_ID, FB_APP_SECRET } = require('../envVariables');

module.exports = {

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  googleAnalyticsCode: process.env.GOOGLE_ANALYTICS_CODE || null,

  // used in passport verification
  facebook: {
    clientID: process.env.FACEBOOK_ID || FACEBOOK_ID,
    clientSecret: process.env.FB_APP_SECRET || FB_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true,
    enableProof: true,
    profileFields: ['accounts', 'first_name', 'last_name'],
    authOptions: { scope: ['manage_pages', 'pages_messaging'] }
  }
};
