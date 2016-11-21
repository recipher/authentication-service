var _ = require('lodash')
  , Promise = require('bluebird')
  , oauthServer = require('koa-oauth-server')
  , request = require('@recipher/request')
  , users = require('@recipher/users')
  , errors = require('@recipher/errors');

var system = users({ name: 'system' });

var model = {
    getClient: function(id, secret, done) {
	  console.log('client', id, secret);
	  
	  done(null, { id: id, secret: secret });
	}

  , grantTypeAllowed: function(client, grant, done) {
  	  done(null, true);
  	}

  , getUser: function(username, password, done) {
  	  console.log(username, password)
	  
	  return request('users/users/search', { user: system }).post({ email: username, password: password })

	  .then(function(data) {
	    if (data.users.length === 0) return done(new errors.NotFoundError());

	    var user = _(data.users).first();

	    if (user.isLocked) return done(new errors.NotAuthorizedError('Locked')); 

	    return done(null, user);
	  })

	  .catch(done);
	}

  , getAccessToken: function(bearerToken, done) {
      console.log('access token', bearerToken);
      return done(null, bearerToken);
	}

  , saveToken: Promise.method(function(token, client, user, done) {
      console.log('save', token, client, user);
      return done(null, token);
	})
};

module.exports = Promise.method(function(server) {
  if (server == null) return;
  server.app.oauth = oauthServer({ model: model, grants: [ 'password' ] });
});
