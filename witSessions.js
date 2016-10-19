// ----------------------------------------------------------------------------
// Wit.ai bot specific code
const { getCompanyAccessToken } = require('./repositories/CompanyRepository');

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid, context, access_token}
const sessions = {};

const findOrCreateSession = (fbUserId, fbPageId) => {
  let sessionId;
  // Let's see if we already have a session for the user fbUserId
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbUserId === fbUserId) {
      // return a promise even though this isnt really async
      // because getCompanyAccessToken returns a promise
      // so we need to be able to call .then() on the return value of findOrCreateSession
      return new Promise((res, rej) => res(k));
    }
  });
  if (!sessionId) {
    sessionId = new Date().toISOString();
    // getting page access token so the server knows which page is supposed to be responding
    return getCompanyAccessToken(fbPageId)
      .then(data => {
        sessions[sessionId] = {
          fbUserId,
          fbPageId,
          access_token: data.access_token,
          context: {}
        };
        return sessionId;
      })
      .catch(e => console.error("error generating session for bot interaction!!", e));
  }
};

module.exports = {
  sessions,
  findOrCreateSession
};
