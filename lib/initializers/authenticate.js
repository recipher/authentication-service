var _ = require('lodash')
  , Promise = require('bluebird')
  , oauthServer = require('koa-oauth-server')
  , request = require('@recipher/request')
  , users = require('@recipher/users')
  , errors = require('@recipher/errors');

var system = users({ name: 'system' });

var model = {
  getClient: function(id, secret, done) {
    done(null, { id: id, secret: secret });
  }

, grantTypeAllowed: function(client, grant, done) {
	  done(null, true);
	}

, getUser: function(username, password, done) {
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
	  return request('users/users', { user: system }).get({ accesstoken: bearerToken })

	  .then(function(data) {
	    if (data.users.length === 0) return done(new errors.NotFoundError());

	    var user = _(data.users).first();

	    if (user.isLocked) return done(new errors.NotAuthorizedError('Locked')); 

	    return done(null, { user: user, expires: new Date });
	  })

	  .catch(done);
	}

, saveAccessToken: function(token, client, expiry, user, done) {
	  return request('users/users/' + user.id, { user: system }).put({ user: { accessToken: token }})

	  .then(function(data) {
	    return done(null, data.user.accessToken);
	  })

	  .catch(done);
	}
};

module.exports = Promise.method(function(server) {
  if (server == null) return;
  server.app.oauth = oauthServer({ model: model, grants: [ 'password' ] });
});
