// ----------------------------------------------------------------------------
// Wit.ai bot specific code
const { getCompanyAccessToken } = require('./repositories/site/CompanyRepository');

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
