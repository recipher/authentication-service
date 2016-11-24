var request = require('@recipher/request');

module.exports = function(middleware, errors) {
  return {
    get: function *(next) {
      this.status = 200;
      this.body = { user: this.request.user };
    }
  };
};