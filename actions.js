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
  send({sessionId}, message) {
    console.log(`replying >> ${message.text}`);
    if (message.quickreplies) {
      message.quick_replies = quickreplies.map(x => {
        return {"title": x, "content_type": "text", "payload": "empty"};
      });
      delete message.quickreplies;
    }
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      return fbMessage(recipientId, message)
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

  bizLocation (bizName) {
    return Company.findLocation(bizName)
      .then(data => {
        if (data) {
          return data.location;
        }
        else { return new Error("couldn't find company to get location of") }
      });
  },

  bizMenu (botID) {
   return Company.getMenu(botID)
     .then(data => {
       if (data) {
         console.log(data);
         return data.menu;
       }
     })
  }
};

function persistentMenu (payload, botID) {
  // bizName needs to be generated programatically
  let response = {};
  return new Promise(function (res, rej) {
    switch (payload) {
      case 'MENU':
        return actions.bizMenu(botID)
          .then(() => {
            response.text = 'working on getting the menu';
            return res(response);
          });
      case 'LOCATION':
        return actions.bizLocation(botID)
          .then(data => {
            response.text = data;
            return res(response);
          });
      default:
        return rej(new Error("couldn't deal with this persistent-menu input"));
    }
  });
}

module.exports = {
  actions,
  persistentMenu
};
