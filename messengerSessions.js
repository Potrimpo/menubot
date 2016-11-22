const { client } = require('./order-list-sessions'),
  { getCompanyAccessToken } = require('./repositories/site/CompanyRepository'),
  { findOrCreateCustomer } = require('./repositories/bot/botQueries');

const findOrCreateSession = (fbUserId, fbPageId) => {
  return client.hgetallAsync(fbUserId)
    .then(data => {
      if (data) {
        console.log("found session in redis:", data);
        // every message extends the session expiration time to 3 minutes from last received message
        return client.expireAsync(fbUserId, 3*60);
      }
      console.log("---->     creating new session      <----");
      return getCompanyAccessToken(fbPageId)
        .then(data => {
          // finding or creating an entry in the Customer database table to store customer info
          findOrCreateCustomer(fbUserId, fbPageId, data.access_token)
            .catch(err => console.error("error finding or creating customer!", err));

          // create session in redis for this interaction, indexed by user id
          // will be used for storing information on orders as they are made
          return client.hmsetAsync(fbUserId, {
            access_token: data.access_token,
          })
            // redis session expires after 3 minutes
            .then(() => client.expireAsync(fbUserId, 3*60));
        });
    })
    .then(() => fbUserId)
    .catch(e => console.error("error generating session for bot interaction!!", e));
};

const redisRecordOrder = (fbUserId, order) => {
  return client.hmsetAsync(fbUserId, {
    itemid: order.itemid ? order.itemid : '',
    typeid: order.typeid ? order.typeid : '',
    sizeid: order.sizeid ? order.sizeid : ''
  })
    .catch(err => console.error("error adding order to redis", err));
};

const redisRetrieveOrder = fbUserId => {
  return client.hgetallAsync(fbUserId)
    .then(data => {
      console.log("retrieveOrder redis data", data);
      return {
        itemid: data.itemid ? data.itemid : undefined,
        typeid: data.typeid ? data.typeid : undefined,
        sizeid: data.sizeid ? data.sizeid : undefined
      }
    })
    .catch(err => console.error("error retrieving order from redis", err));
};

const redisGetToken = fbUserId => {
  return client.hmgetAsync(fbUserId, 'access_token')
    .catch(err => console.error("error getting access token from redis", err));
};

module.exports = {
  findOrCreateSession,
  redisRecordOrder,
  redisRetrieveOrder,
  redisGetToken
};
