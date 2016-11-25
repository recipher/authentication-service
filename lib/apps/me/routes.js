module.exports = function(router, resource, middleware, errors, app) {
  router.get('/', app.oauth.authorise(), resource.me(middleware, errors).get);
};
