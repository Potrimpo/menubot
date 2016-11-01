const { getCompanyAccessToken } = require('./repositories/site/CompanyRepository'),
  { findOrCreateCustomer } = require('./repositories/bot/botQueries');

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid, context, access_token}
const sessions = {};

const findOrCreateSession = (fbUserId, fbPageId) => {
  console.log('sessions.fbUserId =', sessions[fbUserId]);
  if (sessions[fbUserId]) {
    return new Promise((res, rej) => res(fbUserId));
  }
  console.log("---->     creating new session      <----");
  return getCompanyAccessToken(fbPageId)
    .then(data => {
      // finding or creating an entry in the Customer database table to store customer info
      findOrCreateCustomer(fbUserId, fbPageId, data.access_token)
        .catch(err => console.error("error finding or creating customer!", err));
      sessions[fbUserId] = {
        fbUserId,
        fbPageId,
        access_token: data.access_token,
        context: {}
      };
      return fbUserId;
    })
    .catch(e => console.error("error generating session for bot interaction!!", e));
};

module.exports = {
  sessions,
  findOrCreateSession
};
