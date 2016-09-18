'use strict';

var expect = require('expect.js');
var userRepo = require('../../../repositories/UserRepository');
var bcrypt = require('bcrypt-nodejs');

describe('Facebook OAuth', function () {
  this.timeout(5000);

  function createUser() {
    var uniqueness = Date.now();

    return {
      uniqueness: uniqueness,
      email: 'test-fb-' + uniqueness + '@puredev.eu',
      accessToken: 'accToken' + uniqueness,
      refreshToken: 'refToken' + uniqueness,
      profile: {id: uniqueness}
    };
  }

  it('should create properly a new user from facebook', function () {
    var $u = createUser();
    $u.profile._json = {
      accounts: { data: [], paging: {} }
    };

    return userRepo.createAccFromFacebook($u.accessToken, $u.refreshToken, $u.profile)
      .then(function (user) {
        expect(user).to.be.a('object');
        expect(user.facebookId).to.be($u.uniqueness.toString());
      });
  });

  it('should create properly a new user from facebook with a full profile', function () {
    var $u = createUser();

    //structure of the profile is from the actual request, yet data is totally randomized
    //Sorry, Garrett Alexion!
    var sampleProfile = {
      id: $u.uniqueness.toString(),
      username: undefined,
      displayName: 'Garrett Alexion',
      name: {
        familyName: 'Alexion',
        givenName: 'Garrett',
        middleName: undefined
      },
      gender: 'male',
      profileUrl: 'http://www.facebook.com/297638351',
      provider: 'facebook',
      _json: {
        id: $u.uniqueness.toString(),
        first_name: 'Garrett',
        gender: 'male',
        last_name: 'Alexion',
        link: 'http://www.facebook.com/297638351',
        locale: 'en_US',
        name: 'Garrett Alexion',
        timezone: 2,
        updated_time: '2015-06-06T15:55:07+0000',
        verified: true
      }
    };

    return userRepo.createAccFromFacebook($u.accessToken, $u.refreshToken, sampleProfile)
      .then(function (user) {
        expect(user).to.be.a('object');
        expect(user.facebookId).to.be(sampleProfile.id);
        expect(user.profile).to.be.a('object');
        expect(user.profile.name).to.be(sampleProfile.displayName);
        expect(user.profile.gender).to.be(sampleProfile.gender);
      });
  });
});
