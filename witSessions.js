// ----------------------------------------------------------------------------
// Wit.ai bot specific code

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
    sessions[sessionId] = { fbUserId, fbPageId, context: {}};
  }
  return sessionId;
};

module.exports = {
  sessions,
  findOrCreateSession
};
