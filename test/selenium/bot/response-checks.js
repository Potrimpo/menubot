const expect = require('chai').expect,
  dev = require('../../../config/local-dev-variables'),
  txt = require('../../../messaging/message-list');

describe('messenger interaction', function() {
  this.timeout(20000);

  before(function () {
    browser.url('https://www.messenger.com/t/1766837970261548');
    const title = browser.getTitle();
    expect(title).to.equal('Messenger');

    const emailField = $('#email');
    emailField.setValue(dev.email);

    const passwordField = $('#pass');
    passwordField.setValue(dev.password);

    passwordField.submitForm();

    const getStarted = 'div._2xh4._59w_';
    browser.waitForExist(getStarted);
    browser.click(getStarted);
  });

  it('check welcome message', function () {
    const welcomeDiv = `span=${txt.welcome}`;
    browser.waitForExist(welcomeDiv);
  });

  it('get the menu', function () {
    const persistentMenuButton = 'a._3km2';
    browser.waitForExist(persistentMenuButton);
    browser.click(persistentMenuButton);

    const menuButton = 'a=Menu';
    browser.waitForExist(menuButton);
    browser.click(menuButton);

    const structuredMessage = 'div._3cn0';
    browser.waitForExist(structuredMessage);
  });

  after(function () {
    const conversationActions = '#js_4 div._5blh._4-0h._p';
    browser.click(conversationActions);

    const deleteConversation = 'span=Delete';
    browser.click(deleteConversation);

    const bigRedDelete = 'button._3quh._30yy._2t_._3ay_._5ixy';
    browser.waitForExist(bigRedDelete);
    browser.click(bigRedDelete);
  })

});
