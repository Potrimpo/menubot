module.exports = {
  log: require('./lib/log.js'),
  Wit: require('./lib/wit.js').Wit,
  PORT: 8445,
  // remember to change webhook url @ developers.facebook.com/apps/{app-id}/webhooks/
  tunnelURL: 'https://457e8bb0.ngrok.io', // use https && no slash at end (~.com vs ~.com/)
  WIT_TOKEN: 'U2XQR7JKYCAN44AECAEOTA5I2DIASK23',

  // APP = SAVEME
  // Access token: Lewis
  FB_PAGE_TOKEN: 'EAAP0Oze8Cs0BAKbVdE716FjxC8uJjJSgbTiTSt3vbvsOtSQxFp6Fhv2Bxyi2HaM0t4068MXaS8TiaUkMXnpTlwZAH8xNAHwz3gmfwZAfZAIZAQxiHkSK3vWshzgGECpHXnOWbvD8lReYlx4dUb1h4VnMU1z3mCksRZAV5blqZB1wZDZD',
  FB_APP_SECRET: '096eac9cb0c0ad06dd3204440515febc',
  FB_VERIFY_TOKEN: 'saveme'
};
