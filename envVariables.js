module.exports = {
  PORT: process.env.PORT || 8445,

  // remember to change webhook url @ developers.facebook.com/apps/{app-id}/webhooks/
  tunnelURL: 'https://menubot.ngrok.io', // use https && no slash at end (~.com vs ~.com/)

  // link to postgres database
  postgresURL: process.env.postgresURL || 'postgres://localhost:5432/menubot',
  sessionTable: 'session',

  WIT_TOKEN: 'U2XQR7JKYCAN44AECAEOTA5I2DIASK23',

  // FACEBOOK: APP = MENUBOT
  FB_PAGE_TOKEN: 'EAAP0Oze8Cs0BAM1H4QC8aGcTXbOHFVpRhNHjM3ODO6TW3tRTi3Khyy2VhSg43Eorq85qgJW9CVFl9QXRruQHABPacXTC1LrZCAi7mPzhjP4KR6mF6dH5ZAxwEGkOZCfr9BTZAZCk5wi1nE68KcTZBvf9l3SjlEmZApPqRgJ130W4QZDZD',
  FB_APP_SECRET: '096eac9cb0c0ad06dd3204440515febc',
  FB_VERIFY_TOKEN: 'saveme',

  // SenderID (ME) for mocking messages in tests
  senderID: '1149347931815382',
  testPageID: '1221932621201964'
};