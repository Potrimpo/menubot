process.env.postgresPassword = "45FeistyEggsFearY2k";
process.env.postgresURL = "localhost";

const expect = require('chai').expect,
  R = require('ramda'),
  { sequelize, Item } = require('../../../database/models/index'),
  db = require('../../../repositories/site/CompanyRepository'),
  postbackHandler = require('../../../messaging/response-logic/postbackHandler'),
  dev = require('../../../config/local-dev-variables');

describe('testing postbackHandler w mocked input', function() {

  before(function () {
    return sequelize.sync()
      .then(_ =>
        db.insertItem(dev.testPageID, testItem));
  });

  after(function () {
    return deleteTestItem(dev.testPageID, testItem)
  });

  it("fetch the menu", function () {
    const postback = postbackFactory('MENU');
    const ids = {
      userId: dev.senderID,
      pageId: dev.testPageID
    };
    const time = Date.now();

    return postbackHandler(postback, ids, time)
      .then(val => {
        const elements = validatePayload(val);
        expect(val).to.be.an('object');
        expect(elements).to.be.an('array');
        expect(R.head(elements)).to.have.property('buttons');

        const items = pullItemNames(elements);
        expect(items).to.include(testItem)
      });
  });

});

const testItem = 'ROCKS';

const postbackFactory = intent => JSON.stringify({ intent });
const validatePayload = R.path(['attachment', 'payload', 'elements']);
const pullItemNames = R.pluck('title');

const deleteTestItem = (fbid, item) =>
  Item.destroy({
    where: {
      fbid,
      item
    }
  });