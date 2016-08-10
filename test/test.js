const actions = require('../actions');
const expect = require('chai').expect;

describe('bot actions (actions.js)', function() {
  it("checks for products using item it doesn't have", function() {
    const testValue = { product:
      [ { confidence: 0.917140006569473,
        type: 'value',
        value: 'chocolate',
        suggested: true } ],
      intent: [ { confidence: 1, value: 'productQuery' } ]
    };
    return actions.checkProduct({ context: {}, entities: testValue })
      .then(function (data) {
        expect(data).to.have.property('itemNotFound', true);
      })
  });

  it('checks for products using item it DOES have', function () {
    const testValueTrue = { product:
      [ { confidence: 0.917140006569473,
        type: 'value',
        value: 'coffee',
        suggested: true } ],
      intent: [ { confidence: 1, value: 'productQuery' } ]
    };
    return actions.checkProduct({ context: {}, entities: testValueTrue })
      .then(function (data) {
        expect(data).to.have.property('productInfo', 'coffee');
      })
  })
});
