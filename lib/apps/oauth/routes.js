module.exports = function(router, resource, middleware, errors, app) {
  router.post('/token', app.oauth.grant(), resource.token(middleware.errors).post);
};
