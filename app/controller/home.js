'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    const name = await app.redis.get('name');
    console.log('name', name);
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
