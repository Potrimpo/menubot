/**
 * Created by lewis.knoxstreader on 9/09/16.
 */
const { findItem, getMenu, getLocation, getTypes } = require('../sql'),
  { testPageID } = require('../envVariables'),
  expect = require('chai').expect;

describe('testing database queries', function() {

  it("findItem returns item (positive)", function() {
    return findItem(testPageID, 'sandwiches')
      .then(function (data) {
        expect(data).to.not.equal(null);
        expect(data).to.have.property('item', 'sandwiches');
        expect(data).to.have.property('itemid', 2);
      });
  });

  it("findItem returns null", function() {
    return findItem(testPageID, 'rocks')
      .then(function (data) {
        expect(data).to.equal(null);
      });
  });

  it("getMenu returns multiple items", function () {
    return getMenu(testPageID)
      .then(function(data) {
        expect(data).to.exist;
        if(data[0]) {
          expect(data[0]).to.contain.key("item");
          expect(data[0]).to.contain.key("itemid");
        } else {
          expect(data).to.contain.key("item");
          expect(data).to.contain.key("itemid");
        }
      });
  });

  it("getLocation returns valid string", function () {
    return getLocation(testPageID)
      .then(function(data) {
        expect(data).to.contain.key("location");
        expect(data.location).to.be.a("string");
        expect(data.location.length).to.be.greaterThan(0);
      });
  });

  it("getTypes returns multiple values", function () {
    return findItem(testPageID, 'sandwiches')
      .then(function (data) {
        return getTypes(data.itemid);
      })
      .then(function (data) {
        expect(data).to.exist;
        if(data[0]) {
          expect(data[0]).to.contain.key("type");
          expect(data[0]).to.contain.key("typeid");
        } else {
          expect(data).to.contain.key("type");
          expect(data).to.contain.key("typeid");
        }
      });
  });

});
