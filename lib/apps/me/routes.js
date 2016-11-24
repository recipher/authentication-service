var stripAuthorization = function *(next) {
  this.request.headers.Authorization = null;
  yield next;
};

module.exports = function(router, resource, middleware, errors, app) {
  router.get('/', stripAuthorization, app.oauth.authorise(), resource.me(middleware, errors).get);
};
