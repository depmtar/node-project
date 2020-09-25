'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
      if (typeof ctx.body === 'object' && !('errCode' in ctx.body)) { // 正常状态errCode为0
        ctx.body.errCode = 0;
      }
    } catch (error) {
      // 注意：自定义的错误统一处理函数捕捉到错误后也要 `app.emit('error', err, this)`
      // 框架会统一监听，并打印对应的错误日志 common-error.log
      const { app } = ctx;
      app.emit('error', error, this); // 打印日志
      ctx.status = error.statusCode || 500;
      ctx.body = {
        errCode: error.errCode || 40000, // 40000为未设置errCode的默认编码
        errMsg: ctx.status === 422 ? error.errors : error.message,
      };
      error.action && ctx.service.util.log(error.action, error.params, error.message, 'error'); // 业务日志
    }
  };
};
