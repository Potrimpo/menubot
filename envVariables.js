module.exports = {
  // remember to change webhook url @ developers.facebook.com/apps/{app-id}/webhooks/
  tunnelURL: process.env.tunnelURL || '', // use https && no slash at end (~.com vs ~.com/)
  senderID: '1149347931815382', // user id to spoof message the page (find your personal page-scoped id & use that)
  testPageID: '1221932621201964', // the page you'll be testing the bot through

  // facebook.developers app = menubot
  FACEBOOK_ID: 1112960105450189,
  FB_APP_SECRET: "096eac9cb0c0ad06dd3204440515febc"
};
