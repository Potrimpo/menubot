'use strict';

var { User } = require('../database/models/index');
const fetch = require('node-fetch');

exports.getUserById = function(id) {
  return User.findById(id);
};

exports.removeUserById = function(userId) {
  return User.destroy({ where: { id: userId } });
};

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
exports.linkFacebookProfile = function(userId, accessToken, refreshToken, profile) {
  var profileId = profile.id.toString();

  return User.findOne({ where: { facebookId: profileId } })
    .then(function(existingUser) {
      if (existingUser)
        throw 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.';

      return User.findById(userId);
    })
    .then(function(user) {
      user.facebookId = profileId;
      if(!user.tokens) user.tokens = {};
      if(!user.profile) user.profile = {};
      user.tokens.facebook = accessToken;
      user.photo = 'https://graph.facebook.com/' + profile.id+ '/picture?type=large';
      user.set('tokens', user.tokens);
      user.set('profile', user.profile);

      return user.save();
    });
};

exports.createAccFromFacebook = function(accessToken, refreshToken, profile) {
  if(!profile._json) {
    throw 'Facebook profile is missing _json property!';
  }
  console.log("PROFILE", profile);
  console.log("PROFILE.JSON", profile._json);
  var profileId = profile.id.toString();

  return User.findOne({ where: { facebookId: profileId } })
    .then(existingUser => {
      if (existingUser) {
        return existingUser;
      }
    })
    .then(() => {
      const accounts = profile._json.accounts.data.map(company => {
        return getPageAccessToken(accessToken, company.id)
          .then(json => {
            return {
              fbid: company.id,
              name: company.name,
              access_token: json.access_token
            };
          })
      });
      return Promise.all(accounts);
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
    .catch(err => console.error("error creating profile", err.message || err));
};

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