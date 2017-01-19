process.env.postgresPassword = "45FeistyEggsFearY2k";
process.env.postgresURL = "localhost";

const expect = require('chai').expect,
  R = require('ramda'),
  { sequelize } = require('../../../database/models/index'),
  postbackHandler = require('../../../messaging/response-logic/postback-handler'),
  db = require('../../db-test-calls'),
  txt = require('../../../messaging/message-list'),
  dev = require('../../../config/local-dev-variables');

describe('testing postbackHandler w mocked input', function() {

  describe('postbackHandler w no menu, orders, location, etc', function () {

    before(function () {
      return sequelize.sync()
        .then(_ =>
          db.deleteMenu(dev.testPageID))
        .then(_ =>
          db.deleteOrders(dev.testPageID))
        .then(_ =>
          db.setClosed(dev.testPageID))
        .then(_ =>
          db.clearLocation(dev.testPageID));
    });

    it("fetch menu - expect empty", function () {
      const postback = postbackFactory('MENU');
      const time = Date.now();

      return postbackHandler(postback, ids, time)
        .then(resp => {
          const msg = pullMessage(resp);

          expect(msg).to.be.a('string');
          expect(msg).to.equal(txt.emptyMenu);
        });
    });

    it("fetch my orders - expect none", function () {
      const postback = postbackFactory('MY_ORDERS');
      const time = Date.now();

      return postbackHandler(postback, ids, time)
        .then(resp => {
          const msg = pullMessage(resp);

          expect(msg).to.be.a('string');
          expect(msg).to.equal(txt.noOrders);
        });
    });

    it("check open hours - expect closed", function () {
      const postback = postbackFactory('HOURS');
      const time = Date.now();

      return postbackHandler(postback, ids, time)
        .then(resp => {
          const msg = pullMessage(resp);

          expect(msg).to.be.a('string');
          expect(msg).to.equal(txt.hoursCheck.closed);
        });
    });

    it("check location - expect not known", function () {
      const postback = postbackFactory('LOCATION');
      const time = Date.now();

      return postbackHandler(postback, ids, time)
        .then(resp => {
          const msg = pullMessage(resp);

          expect(msg).to.be.a('string');
          expect(msg).to.equal(txt.locationCheck.notFound);
        });
    });

  });

  describe('postbackHandler w set fields, existing menu', function () {

    before(function () {
      return sequelize.sync()
        .then(_ =>
          db.deleteMenu(dev.testPageID))
        .then(_ =>
          db.deleteOrders(dev.testPageID))
        .then(_ =>
          db.setClosed(dev.testPageID))
        .then(_ =>
          db.clearLocation(dev.testPageID));
    });
  })

});

const ids = {
  userId: dev.senderID,
  pageId: dev.testPageID
};

const pullMessage = R.prop('text');

const postbackFactory = intent => JSON.stringify({ intent });
const validatePayload = R.path(['attachment', 'payload', 'elements']);
const pullItemNames = R.pluck('title');
