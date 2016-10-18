// ----------------------------------------------------------------------------
// Wit.ai bot specific code
const { getCompanyAccessToken } = require('./repositories/CompanyRepository');

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbUserId, fbPageId) => {
  let sessionId;
  // Let's see if we already have a session for the user fbUserId
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbUserId === fbUserId) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbUserId, let's create a new one
    sessionId = new Date().toISOString();
    return getCompanyAccessToken(fbPageId)
      .then(data => {
        console.log("----- GOT THE ACCESS TOKEN -----", data.access_token);
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
