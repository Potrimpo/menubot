module.exports = {
  PORT: process.env.PORT || 8445,

  // remember to change webhook url @ developers.facebook.com/apps/{app-id}/webhooks/
  tunnelURL: 'https://59909489.ngrok.io', // use https && no slash at end (~.com vs ~.com/)

  // link to postgres database
  postgresURL: 'postgres://localhost:5432/menubot',
  sessionTable: 'session',

  WIT_TOKEN: 'U2XQR7JKYCAN44AECAEOTA5I2DIASK23',

  // FACEBOOK: APP = SAVEME
  FB_PAGE_TOKEN: 'EAAP0Oze8Cs0BAKbVdE716FjxC8uJjJSgbTiTSt3vbvsOtSQxFp6Fhv2Bxyi2HaM0t4068MXaS8TiaUkMXnpTlwZAH8xNAHwz3gmfwZAfZAIZAQxiHkSK3vWshzgGECpHXnOWbvD8lReYlx4dUb1h4VnMU1z3mCksRZAV5blqZB1wZDZD',
  FB_APP_SECRET: '096eac9cb0c0ad06dd3204440515febc',
  FB_VERIFY_TOKEN: 'saveme',

  // SenderID (ME) for mocking messages in tests
  senderID: '1383034061711690',
  testPageID: '1766837970261548'
};
