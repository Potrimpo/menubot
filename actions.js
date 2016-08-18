const { sessions } = require('./witSessions'),
  fbMessage = require('./messenger'),
  mongoose = require('mongoose'),
  { Company } = require('./db');

mongoose.Promise = global.Promise;

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
  send({sessionId}, {text, quickreplies}) {
    console.log(`replying >> ${text}`);
    let quick_replies;
    if (quickreplies) {
      quick_replies = quickreplies.map(x => {
        return { "title": x, "content_type": "text", "payload": "empty" };
      });
    } else { quick_replies = undefined; }
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      return fbMessage(recipientId, text, quick_replies)
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

  // check if item x is in database
  checkProduct({context, entities}) {
    const prod = firstEntityValue(entities, 'product');
    return new Promise((res, rej) => {
      if(prod) {
        return Company.findProduct('Menubot-tester', prod)
          .then(data => {
            if (data) {
              context.productInfo = prod;
              delete context.itemNotFound;
              return res(context);
            }
            else {
              context.itemNotFound = true;
              delete context.productInfo;
              return res(context);
            }
          })
          .catch(err => {
            console.error(err);
            return rej(err);
          });
      }
    });
  },

  bizLocation (context) {
    return Company.findLocation('Menubot-tester')
      .then(data => {
        if (data) {
          context.location = data.location;
          return context;
        }
        else { return new Error("couldn't find company to get location of") }
      });
  }
};

function persistentMenu (payload, context) {
  let response = {};
  return new Promise(function (res, rej) {
    switch (payload) {
      case 'MENU':
        response.text = 'working on getting the menu';
        break;
      case 'LOCATION':
        return actions.bizLocation(context)
          .then(data => {
            response.text = data.location;
            return res(response);
          });
      default:
        return rej(new Error("coudn't deal with this persistent-menu input"));
    }
    return res(response);
  })
}

module.exports = {
  actions,
  persistentMenu
};
