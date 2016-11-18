const redis = require('redis'),
  bluebird = require('bluebird'),
  { getCompanyAccessToken } = require('./repositories/site/CompanyRepository'),
  { findOrCreateCustomer } = require('./repositories/bot/botQueries');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();

client.onAsync('connect').then(() => console.log('----> redis connected'));

const sessions = {};

const findOrCreateSession = (fbUserId, fbPageId) => {
  console.log('sessions.fbUserId =', sessions[fbUserId]);
  client.hgetallAsync(fbUserId)
    .then(data => {
      console.log("after checking redis");
      if (data) {
        console.log("found in redis:", data);
        return null;
      }
    });

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
      return client.hmsetAsync(fbUserId, 'pageID', fbPageId, 'access_token', data.access_token)
    })
    .then(data => {
      console.log("redis set status", data);
      return fbUserId;
    })
    .catch(e => console.error("error generating session for bot interaction!!", e));
};

module.exports = {
  sessions,
  findOrCreateSession
};
