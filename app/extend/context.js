'use strict';

module.exports = {

  /**
   * 统一的路由错误处理
   * @param {string} msg 错误消息
   * @param {object} props 当传入number时，props为errCode, 当传入对象时，将属性挂载到error对象上。
   * 支持属性 errCode, params, action 其它属性挂载后暂不处理，如需处理请在app/middleware/error_handler.js文件中添加处理逻辑
   * @param {number} statusCode http状态码，default: 400
   * @return {Error} Error对象
   * */
  createHttpError(msg, props, statusCode = 400) {
    const err = msg instanceof Error ? msg : new Error(msg);
    if (typeof props === 'number') {
      props = { errCode: props };
    }
    if (typeof props === 'object') {
      Object.assign(err, props);
    }
    err.statusCode = statusCode;
    return err;
  },
};

