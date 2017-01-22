const expect = require('chai').expect,
  dev = require('../../../config/local-dev-variables'),
  txt = require('../../../messaging/message-list');

describe('bot response-checks', function() {
  this.timeout(20000);

  // go to messenger & login
  before(function () {
    browser.url('https://www.messenger.com/');
    const title = browser.getTitle();
    expect(title).to.equal('Messenger');

    const emailField = $('#email');
    emailField.setValue(dev.email);

    const passwordField = $('#pass');
    passwordField.setValue(dev.password);

    passwordField.submitForm();
  });

  // get past the get-started button
  beforeEach(function () {
    browser.url(`https://www.messenger.com/t/${dev.testPageID}`);

    const getStarted = 'div._2xh4._59w_';
    waitAndDo(getStarted, 'click');
  });

  // delete conversation to start afresh
  afterEach(function () {
    const conversationActions = '#js_4 div._5blh._4-0h._p';
    browser.click(conversationActions);

    const deleteConversation = 'span=Delete';
    browser.click(deleteConversation);

    const bigRedDelete = 'button._3quh._30yy._2t_._3ay_._5ixy';
    browser.waitForExist(bigRedDelete);
    browser.click(bigRedDelete);
  });

  it('check welcome message', function () {
    const welcomeDiv = msg(txt.welcome);
    waitAndDo(welcomeDiv);
  });

  describe('persistent-menu response-checks', function () {

    it('check menu: expects items', function () {
      persistentMenuSelect('Menu');

      const structuredMessage = 'div._3cn0';
      waitAndDo(structuredMessage);
    });

    it('check myOrders: expects none', function () {
      persistentMenuSelect('My Orders');

      const returned = msg(txt.noOrders);
      waitAndDo(returned);
    });

    it('check location: expects not known', function () {
      persistentMenuSelect('Location');

      const noLocation = msg(txt.locationCheck.notFound);
      waitAndDo(noLocation);
    });

    it('check hours: expects closed', function () {
      persistentMenuSelect('Hours');

      const hours = msg(txt.hoursCheck.closed);
      waitAndDo(hours);
    });

  });

});

const msg = txt => `span=${txt}`;

// have to pass action as string
// passing browser.click first class glitches the scope
const waitAndDo = (selector, action) => {
  browser.waitForExist(selector);
  if (action) browser[action](selector);
};

const persistentMenuSelect = type => {
  const persistentMenuButton = 'a._3km2';
  waitAndDo(persistentMenuButton, 'click');

  const button = `a=${type}`;
  waitAndDo(button, 'click');
};
