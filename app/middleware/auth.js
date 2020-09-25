'use strict';

module.exports = options => {
  return async function auth(ctx, next) {
    console.log('auth success >>>');
    await next();
  };
};
