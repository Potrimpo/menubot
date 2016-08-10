const witSessions = require('./witSessions');
const fbMessage = require('./messenger');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};


// Our bot actions
const actions = {
  send({sessionId}, {text}) {
    console.log(`replying to message with: ${text}`);
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = witSessions.sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      return fbMessage(recipientId, text)
        .then(() => null)
        .catch((err) => {
          console.error(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err.stack || err
          );
          console.log(`was trying to send: ${text}`);
        });
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      return Promise.resolve()
    }
  },

  checkProduct({sessionID, context, entities}) {
    // Retrieve the loc entity and store it into a context field
    const prod = firstEntityValue(entities, 'product');
    return new Promise((res, rej) => {
      if(prod) {
        console.log(`product is ${prod}`);
        if (prod == 'coffee') {
          context.productInfo = prod;
          delete context.itemNotFound;
        }
        else {
          context.itemNotFound = true;
          delete context.productInfo;
        }
      }
      console.log('context:');
      console.log(context);
      return res(context);
    });
  }
};

module.exports = actions;
