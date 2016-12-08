'use strict';

const { User, Key } = require('../../database/models/index'),
  fetch = require('node-fetch');

exports.getUserById = function(id) {
  return User.findById(id);
};

exports.removeUserById = function(userId) {
  return User.destroy({ where: { id: userId } });
};

exports.checkKey = key => Key.findById(key);

exports.unlinkProviderFromAccount = function(provider, userId) {
  return User.findById(userId)
    .then(function(user) {
      if(!user)
        throw 'User was not found.';

      var attrInfo = {};
      attrInfo[provider + 'Id'] = null;
      attrInfo.tokens = user.tokens || {};
      attrInfo.tokens[provider.toLowerCase()] = null;
      if(provider === 'twitter')
        attrInfo.tokens.twitterSecret = null;

      return user.updateAttributes(attrInfo);
    });
};


/**
 * Facebook
 */
exports.loginOrCreateAcc = function(accessToken, refreshToken, profile) {
  if(!profile._json) {
    throw 'Facebook profile is missing _json property!';
  }
  const profileId = profile.id.toString();

  return User.findOne({ where: { facebookId: profileId } })
    .then(existingUser => {
      if (existingUser) {
        console.log("   Existing user !!!");
        return existingUser;
      }
      console.log("   No user found !!!");
      return createAcc(accessToken, profile);
    })
};

function createAcc(accessToken, profile) {
  const profileId = profile.id.toString();
  return new Promise((res, rej) => {

    const accounts = profile._json.accounts.data.map(company => {
      return getPageAccessToken(accessToken, company.id)
        .then(json => {
          return {
            fbid: company.id,
            name: company.name,
            access_token: json.access_token
          };
        })
        .catch(err => rej("error getting pageAccessToken", err));
    });
    return res(Promise.all(accounts));

  })
  .then(accounts => {
    var user = User.build({facebookId: profileId});
    user.set('accounts', accounts);
    user.email = profile._json.email || ( profileId + '@facebook.com' );
    user.token = accessToken;
    user.name = profile.name.givenName + ' ' + profile.name.familyName;
    user.photo = 'https://graph.facebook.com/' + profile.id+ '/picture?type=large';
    user.profile = { name: profile._json.first_name };
    return user.save();
  })
  .catch(err => console.error("error creating account!", err));
}

function getPageAccessToken (userToken, pageId) {
  pageId = encodeURIComponent(pageId);
  userToken = encodeURIComponent((userToken));
  const query = `https://graph.facebook.com/${pageId}?fields=access_token&access_token=${userToken}`;
  console.log("QUERY =", query);
  return fetch(query, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log("json ============= ", json);
      return json;
    })
    .catch(err => console.error("error fetching access token!!", err));
}