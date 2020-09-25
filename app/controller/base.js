'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(data, msg) {
    this.ctx.body = {
      code: '200',
      msg: msg || 'success',
      data: data || '',
    };
  }

  async err(msg) {
    this.ctx.body = {
      code: '400',
      msg: msg || '',
      data: '',
    };
  }
}

module.exports = BaseController;
