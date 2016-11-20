var Promise = require('bluebird')
  , oauthServer = require('oauth2-server');

var model = {
  getAccessToken: function *(bearerToken) {

  }
, getClient: function *(id, secret) {

  }
, getUser: function *(username, password) {

  }
, saveToken: function *(token, client, user) {

  }
};

module.exports = Promise.method(function(app) {
  app.oauth = oauthServer({
    model: model
  });
});