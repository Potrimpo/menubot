/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" API keys and passwords so
 * that all features could work out of the box.
 *
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */
'use strict';

module.exports = {

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  //will be generated. Take a look at the bottom of this file
  postgres: {},
  googleAnalyticsCode: process.env.GOOGLE_ANALYTICS_CODE || null,

  sendgrid: {
    api_key: process.env.SENDGRID_APIKEY || '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'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '1112960105450189',
    clientSecret: process.env.FACEBOOK_SECRET || '096eac9cb0c0ad06dd3204440515febc',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true,
    enableProof: true,
    profileFields: ['accounts', 'first_name', 'last_name'],
    authOptions: { scope: ['manage_pages'] }
  }
};
