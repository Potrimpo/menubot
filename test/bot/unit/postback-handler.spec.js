process.env.postgresPassword = "45FeistyEggsFearY2k";
process.env.postgresURL = "localhost";

const expect = require('chai').expect,
  R = require('ramda'),
  { sequelize } = require('../../../database/models/index'),
  postbackHandler = require('../../../messaging/response-logic/postback-handler'),
  db = require('../db-bot-test-calls'),
  time = require('../../../messaging/time-management'),
  txt = require('../../../messaging/message-list'),
  dev = require('../../../config/local-dev-variables');

describe('testing postbackHandler w mocked input', function() {

  describe('no menu, orders, location, etc', function () {

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

  describe('set fields, existing menu, etc', function () {

    const item = "Coffee",
          price = 3,
          quantity = 4;

    const tStamp = Date.now(),
      tz = 'Pacific/Auckland';

    const orderTime = time.orderDateTime('4pm', tStamp, tz);

    before(function () {
      return sequelize.sync()
        .then(_ =>
          db.insertItem(dev.testPageID, item, price))
        .then(x =>
          db.createOrder(dev.testPageID, dev.senderID, orderTime, x.itemid, quantity))
        .then(_ =>
          db.setOpen(dev.testPageID))
        .then(_ =>
          db.setLocation(dev.testPageID));
    });

    it("fetch menu - expect one item", function () {
      const postback = postbackFactory('MENU');
      const time = Date.now();

      return postbackHandler(postback, ids, time)
        .then(resp => {
          const msg = validatePayload(resp);
          const expectedTitle = item.toUpperCase() + ' - $' + price;
          const title = pullTitle(R.head(msg));

          expect(msg).to.be.an('array');
          expect(msg).to.have.length(1);
          expect(title).to.equal(expectedTitle);
        });
    });

    it("fetch orders - expect one", function () {
      const postback = postbackFactory('MY_ORDERS');
      const time = Date.now();

      return postbackHandler(postback, ids, time)
        .then(resp => {
          const msg = validatePayload(resp);
          expect(msg).to.be.an('array');
          expect(msg).to.have.length(1);

          const order = R.head(msg);
          const title = pullTitle(order);
          const subtitle = pullSubtitle(order);

          const expectedTitle = `${quantity}x ${item.toUpperCase()}`,
                expectedSubtitle = `$${quantity * price}`

          expect(title).to.equal(expectedTitle);
          expect(subtitle).to.contain(expectedSubtitle);
        });
    });

    it("check open hours - expect 9am - 5pm", function () {
      const postback = postbackFactory('HOURS');
      const time = Date.now();

      return postbackHandler(postback, ids, time)
        .then(resp => {
          const msg = pullMessage(resp);

          expect(msg).to.be.a('string');
          expect(msg).to.equal(txt.hoursCheck.open('9am', '5pm'));
        });
    });

    it("check location - expect 123 Fake Street", function () {
      const postback = postbackFactory('LOCATION');
      const time = Date.now();

      return postbackHandler(postback, ids, time)
        .then(resp => {
          const msg = pullMessage(resp);

          expect(msg).to.be.a('string');
          expect(msg).to.equal(txt.locationCheck.found('123 Fake Street'));
        });
    });

  });

});

const ids = {
  userId: dev.senderID,
  pageId: dev.testPageID
};

const pullMessage = R.prop('text');

const postbackFactory = intent => JSON.stringify({ intent });
const validatePayload = R.path(['attachment', 'payload', 'elements']);
const pullTitle = R.prop('title');
const pullSubtitle = R.prop('subtitle');
