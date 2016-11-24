/**
 * Created by lewis.knoxstreader on 24/11/16.
 */

const redis = require('redis'),
  bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();

client.onAsync('connect')
  .then(() => console.log('----> redis connected'));

module.exports = client;
