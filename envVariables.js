module.exports = {
  PORT: process.env.PORT || 8445,

  // remember to change webhook url @ developers.facebook.com/apps/{app-id}/webhooks/
  tunnelURL: process.env.tunnelURL || '', // use https && no slash at end (~.com vs ~.com/)

  // link to postgres database
  postgresURL: process.env.postgresURL || 'localhost',
  postgresPassword: process.env.postgresPassword,

  serverIP: process.env.serverIP || 'localhost',
  sessionTable: 'session',

  // FACEBOOK: APP = MENUBOT
  FB_APP_SECRET: process.env.FACEBOOK_ID || '096eac9cb0c0ad06dd3204440515febc',
  FB_VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN || 'saveme',

  // SenderID (ME) for mocking messages in tests
  senderID: '1149347931815382',
  testPageID: '1221932621201964'
};