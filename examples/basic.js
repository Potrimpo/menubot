'use strict';

const Wit = require('../lib/wit').Wit;

// const accessToken = (() => {
//   if (process.argv.length !== 3) {
//     console.log('usage: node examples/basic.js <wit-access-token>');
//     process.exit(1);
//   }
//   return process.argv[2];
// })();
const accessToken = '5RDEBULKJRFM6VQT3JYJDEVZ2RHU3TCE';

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

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('user said...', request.text);
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },

  checkLocation({ context, entities }) {
    // Retrieve the loc entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
    return new Promise((res, rej) => {
      if (loc) {
        context.loc = loc;
        context.missingLocation = false;
        // if (context.missingLocation)  { delete context.missingLocation; }
      }
      else { context.missingLocation = true; }
      res(context);
    });
  },
  error({ context, error }) {
    console.log(error.message);
  },

  // fetch-weather bot executes
  getWeather({ context }) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    return new Promise((res, rej) => {
      if(context.loc == "New York") {
        context.forecast = 'real good'
      }
      else {
        context.forecast = 'absolute shite';
      }
      res(context);
    });
  }

};

const client = new Wit({accessToken, actions});
client.interactive();
