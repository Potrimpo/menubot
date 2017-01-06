// /**
//  * Created by lewis.knoxstreader on 9/09/16.
//  */
const chrono = require('chrono-node'),
  { testPageID, senderID } = require('../envVariables'),
  companyRepo = require('../repositories/site/CompanyRepository'),
  botQueries = require('../repositories/bot/botQueries'),
  { dateParsing } = require('./testFunctionsAll'),
  expect = require('chai').expect;

describe('testing database queries', function() {
  this.timeout(3000);
  afterEach(function (done) { setTimeout(done, 1000) });

  let globalOrders = [];

  before(function () {
    console.log("SETTING UP SOME ORDERS");
    const time = chrono.parseDate('10am');
    const makeOrder1 = botQueries.makeOrder(testPageID, senderID, 2, time),
      makeOrder2 = botQueries.makeOrder(testPageID, senderID, 2, time);

    globalOrders.push(makeOrder1, makeOrder2);
    return Promise.all(globalOrders).then(data => globalOrders = data);
  });

  after(function () {
    console.log("CLEANING UP");
    return Promise.all(
      globalOrders.map(val => botQueries.deleteOrder(val.orderid))
    );
  });

  it("makeOrder testing", function() {
    const time = chrono.parseDate('4pm');
    return botQueries.makeOrder(testPageID, senderID, 1, time)
      .then(function () {
        return botQueries.findOrder(testPageID, senderID, 1);
      })
      .then(function (data) {
        expect(data).to.not.equal(null);
        expect(data.pending).to.equal(true);
        const orderid = data.orderid;
        return botQueries.deleteOrder(orderid);
      })
      .then(function (data) {
        console.log("data from deleteOrder", data);
      });
  });

  //requires multiple orders already in database
  it("ordersByFbid testing", function() {
    const today = dateParsing();
    return companyRepo.ordersByFbid(testPageID)
      .then(function (data) {
        expect(data).to.not.equal(null);
        // [ 'to.contain.all' means can have more ] [ 'to.have.all' means has these and only these ]
        expect(data[0]).to.contain.all.keys("orderid", "price", "fbid", "customer_id");
        expect(data[0]).to.have.property('fbid', testPageID);
      });
  });

});
