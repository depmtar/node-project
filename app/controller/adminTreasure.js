'use strict';

const Controller = require('./base');

module.exports = app => {
  class AdminTreasureController extends Controller {

    /**
     * 管理台夺宝活动列表
     * @author 张亮
     */
    async index() {
      const { ctx } = this;
      const logPrefix = '管理台夺宝活动列表';
      const query = ctx.request.query;
      app.logger.info(logPrefix, JSON.stringify(query));
      // 数据查询
      const treasures = await ctx.modelmysql.Treasure.findAll(query);
      this.success(treasures);
      app.logger.info(logPrefix, 'success');
    }

    /**
     * 管理台夺宝活动详情
     * @author 张亮
     */
    async show() {
      const { ctx } = this;
      const logPrefix = '管理台夺宝活动详情';
      app.logger.info(logPrefix, JSON.stringify(ctx.params.id));
      // 数据查询
      const treasure = await ctx.modelmysql.Treasure.findOne({
        where: { id: ctx.params.id },
      });
      this.success(treasure);
      app.logger.info(logPrefix, 'success');
    }

    /**
     * 管理台夺宝活动新增
     * @author 张亮
     */
    async create() {
      const { ctx } = this;
      const logPrefix = '管理台夺宝活动新增';
      const data = ctx.request.body;
      app.logger.info(logPrefix, JSON.stringify(data));
      // 参数校验
      // await this.ctx.verify('admin_treasure.create', 'body');
      // 数据存储
      const treasure = await ctx.modelmysql.Treasure.create(data);
      this.success(treasure);
      app.logger.info(logPrefix, 'success');
    }

    /**
     * 管理台夺宝活动更新
     * @author 张亮
     */
    async update() {
      const { ctx } = this;
      const logPrefix = '管理台夺宝活动更新';
      const data = ctx.request.body;
      app.logger.info(logPrefix, JSON.stringify(Object.assign(data, ctx.params)));
      // 数据更新
      await ctx.modelmysql.Treasure.update(data, { where: { id: ctx.params.id } });
      this.success();
      app.logger.info(logPrefix, 'success');
    }

    /**
     * 管理台夺宝活动删除
     * @author 张亮
     */
    async destroy() {
      const { ctx } = this;
      const logPrefix = '管理台夺宝活动删除';
      const data = ctx.request.body;
      app.logger.info(logPrefix, JSON.stringify(Object.assign(data, ctx.params)));
      // 数据更新
      await ctx.modelmysql.Treasure.update(data, { where: { id: ctx.params.id } });
      this.success();
      app.logger.info(logPrefix, 'success');
    }
  }
  return AdminTreasureController;
};
