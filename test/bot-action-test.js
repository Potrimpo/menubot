/* Created by lewis.knoxstreader on 13/08/16. */

const actions = require('../messaging/actions'),
  expect = require('chai').expect,
  // pgp = require('pg-promise')(),
  { dbQueryFactory } = require('./functionsForTests'),
  { testPageID } = require('../envVariables');

// DON'T PUT CATCH STATEMENTS IN MOCHA-INVOLVED PROMISES. WHEN AN ASSERTION FAILS IT ERRORS
// CATCH STATEMENTS WILL STOP MOCHA FROM PICKING UP ON THE FAILURE

describe('testing bot actions with database', function() {
  let mockQuery;

  it("checks for products using item it DOESN'T have", function() {
    mockQuery = dbQueryFactory('rocks');
    return actions.checkProduct({ context: {}, entities: mockQuery, fbPageId: testPageID })
      .then(function (data) {
        expect(data).to.not.haveOwnProperty('productInfo');
        expect(data).to.have.property('itemNotFound', true);
      })
  });

  it('checks for products using item it DOES have', function () {
    mockQuery = dbQueryFactory('coffee');
    return actions.checkProduct({ context: {}, entities: mockQuery, fbPageId: testPageID })
      .then(function (data) {
        expect(data).to.not.haveOwnProperty('itemNotFound');
        expect(data).to.have.property('productInfo', 'coffee');
      })
  })
});
