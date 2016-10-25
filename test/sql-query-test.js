// /**
//  * Created by lewis.knoxstreader on 9/09/16.
//  */
const chrono = require('chrono-node'),
  { testPageID, senderID } = require('../envVariables'),
  companyRepo = require('../repositories/site/CompanyRepository'),
  { dateParsing } = require('./testFunctionsAll'),
  expect = require('chai').expect;

describe('testing database queries', function() {
  this.timeout(1000);

  it("getOrders testing", function() {
    const today = dateParsing();
    return companyRepo.getOrders(testPageID, today)
      .then(function (data) {
        console.log("TEST DATA == ", data);
        expect(data).to.not.equal(null);
        expect(data[0]).to.contain.key("orderid");
        // expect(data).to.have.property('itemid', 2);
      });
  });

  // it("findItem returns null", function() {
  //   return findItem(testPageID, 'rocks')
  //     .then(function (data) {
  //       expect(data).to.equal(null);
  //     });
  // });

  // it("getMenu returns multiple items", function () {
  //   return getMenu(testPageID)
  //     .then(function(data) {
  //       expect(data).to.exist;
  //       if(data[0]) {
  //         expect(data[0]).to.contain.key("item");
  //         expect(data[0]).to.contain.key("itemid");
  //       } else {
  //         expect(data).to.contain.key("item");
  //         expect(data).to.contain.key("itemid");
  //       }
  //     });
  // });
  //
  // it("getLocation returns valid string", function () {
  //   return getLocation(testPageID)
  //     .then(function(data) {
  //       expect(data).to.contain.key("location");
  //       expect(data.location).to.be.a("string");
  //       expect(data.location.length).to.be.greaterThan(0);
  //     });
  // });
  //
  // it("getTypes returns multiple values", function () {
  //   return findItem(testPageID, 'sandwiches')
  //     .then(function (data) {
  //       return getTypes(data.itemid);
  //     })
  //     .then(function (data) {
  //       expect(data).to.exist;
  //       if(data[0]) {
  //         expect(data[0]).to.contain.key("type");
  //         expect(data[0]).to.contain.key("typeid");
  //       } else {
  //         expect(data).to.contain.key("type");
  //         expect(data).to.contain.key("typeid");
  //       }
  //     });
  // });
  //
  // it("makeOrder inserts into orders table", function () {
  //   const witTime = '2016-09-12T08:25:00.000-07:00',
  //     queryTime = 'september 12th 8:25am';
  //   return makeOrder(testPageID, senderID, 2, 2, witTime)
  //     .then(function (data) {
  //       // Chrono can't deal with datetime values from wit.ai
  //       const parsedQueryTime = chrono.parseDate(queryTime),
  //         parsedReturnedTime = chrono.parseDate(String(data.pickuptime));
  //       expect(data).to.exist;
  //       expect(data).to.contain.key("pickuptime");
  //       expect(String(parsedReturnedTime)).to.equal(String(parsedQueryTime));
  //     });
  // });
  //
  // it("orderDetails retrieves data from specific order", function () {
  //   const sizeid = 1;
  //   return orderDetails(sizeid)
  //     .then(function (data) {
  //       expect(data).to.exist;
  //       expect(data).to.contain.all.keys("size", "type", "item", "itemid", "typeid", "sizeid");
  //       expect(data).to.have.property("size", "large");
  //     })
  // })

});
