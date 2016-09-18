"use strict";

//global requires
var async = require('neo-async');

//specific requires
var graph;

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
exports.getFacebook = function(req, res, next) {
  graph = require('fbgraph');

  var token = req.user.tokens.facebook;
  graph.setAccessToken(token);
  async.parallel({
    getMe: function(done) {
      graph.get(req.user.facebookId, function(err, me) {
        done(err, me);
      });
    },
    getMyFriends: function(done) {
      graph.get(req.user.facebookId + '/friends', function(err, friends) {
        done(err, friends.data);
      });
    }
  },
  function(err, results) {
    if (err) return next(err);
    console.log("--- RESULTO ----");
    console.log(results.getMe);
    res.render('api/facebook', {
      title: 'Facebook API',
      me: results.getMe,
      friends: results.getMyFriends
    });
  });
};
