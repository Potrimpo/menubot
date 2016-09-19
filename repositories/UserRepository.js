'use strict';

var { User } = require('../database/models/index');

var repo = {};

function addAvatarToProfile(provider, url, profile) {
  if(!profile.avatars)
    profile.avatars = {};

  if(!url || url.length < 1)
    return;

  profile.avatars[provider] = url;
  if(!profile.picture)
    profile.picture = url;
}

repo.getUserById = function(id) {
  return User.findById(id);
};

repo.removeUserById = function(userId) {
  return User.destroy({ where: { id: userId } });
};

repo.unlinkProviderFromAccount = function(provider, userId) {
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
repo.linkFacebookProfile = function(userId, accessToken, refreshToken, profile) {
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
      user.profile.name = user.profile.name || profile.displayName;
      user.profile.gender = user.profile.gender || profile._json.gender;
      addAvatarToProfile('facebook', 'https://graph.facebook.com/' + profileId + '/picture?type=large', user.profile);
      user.set('tokens', user.tokens);
      user.set('profile', user.profile);

      return user.save();
    });
};

repo.createAccFromFacebook = function(accessToken, refreshToken, profile) {
  if(!profile._json) {
    throw 'Facebook profile is missing _json property!';
  }
  console.log("PROFILE", profile);
  console.log("PROFILE.JSON", profile._json);
  var profileId = profile.id.toString();

  return User.findOne({ where: { facebookId: profileId } })
    .then(function(existingUser) {
      if (existingUser) { return existingUser; }
      var user = User.build({ facebookId: profileId });
      user.email = profile._json.email || ( profileId + '@facebook.com' );
      user.tokens = { facebook: accessToken };
      user.name = profile.name.givenName + ' ' + profile.name.familyName;
      user.profile = {
        name: profile._json.first_name,
        gender: profile.gender
      };
      addAvatarToProfile('facebook', 'https://graph.facebook.com/' + profileId + '/picture?type=large', user.profile);
      return user.save();
    });
};

module.exports = repo;