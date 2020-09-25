'use strict';

const BaseController = require('./base');
const { Sequelize, Transaction } = require('sequelize');
const Op = Sequelize.Op;

module.exports = app => {
  class TreasureController extends BaseController {
    /**
     * 夺宝列表
     * @author 张亮 zhangliang@99ex.com
     */
    async list() {
      const { ctx } = this;
      const logPrefix = '夺宝列表';
      const query = ctx.request.query;
      const where = { is_alive: true };
      const { state = 'start' } = query;
      if (state === 'start') {
        where.end_time = { [Op.gt]: Date.now() };
      } else {
        where.end_time = { [Op.lte]: Date.now() };
      }
      const treasures = await ctx.modelmysql.Treasure.findAll({
        where,
        order: [[ 'end_time', 'DESC' ], [ 'created_at', 'ASC' ]],
      });
      this.success(treasures);
      app.logger.info(logPrefix, 'success');
    }

    /**
     * 夺宝详情
     * @author 张亮 zhangliang@99ex.com
     */
    async join() {
      const { ctx } = this;
      const logPrefix = '夺宝详情';
      const data = ctx.request.body;
      app.logger.info(logPrefix, JSON.stringify(data));
      const { treasure_id, uid } = data;
      const treasure = await ctx.modelmysql.Treasure.findOne({
        where: { id: treasure_id, is_alive: true },
        attributes: [ 'name', 'icon_url', 'content', 'price', 'start_time', 'end_time', 'people_number', 'nt_size' ],
      });
      if (!treasure) return this.err('当前夺宝活动无效！');
      const treasureRecord = await ctx.modelmysql.TreasureRecord.findOne({
        where: { uid, treasure_id },
        attributes: [[ 'id', 'luck_num' ], 'nt_size', 'nt_before', 'nt_after', 'is_lucky' ],
      });
      const result = { treasure, treasureRecord };
      this.success(result);
      app.logger.info(logPrefix, uid, 'success');
    }

    /**
     * 夺宝兑换
     * @author 张亮 zhangliang@99ex.com
     */
    async exchange() {
      const { ctx } = this;
      const logPrefix = '夺宝兑换';
      const data = ctx.request.body;
      app.logger.info(logPrefix, JSON.stringify(data));
      const { treasure_id, uid } = data;
      // 校验 活动生效状态
      const treasure = await ctx.modelmysql.Treasure.findOne({ where: { id: treasure_id, is_alive: true } });
      if (!treasure) return this.err('当前夺宝活动无效！');
      const { nt_size, start_time, end_time, people_number } = treasure;
      // 校验 活动时间
      if (start_time > Date.now()) return this.err('该活动还未开始，请稍后！');
      if (end_time < Date.now()) return this.err('该活动已结束！');
      // 校验 是否兑换
      const treasureRecord = await ctx.modelmysql.TreasureRecord.findOne({ where: { uid, treasure_id } });
      if (treasureRecord) return this.err('请勿重复参与兑换！');
      // 校验 参与人数
      const count = await ctx.modelmysql.TreasureRecord.count({ where: { treasure_id, uid: { [Op.ne]: uid } } });
      if (count >= people_number) return this.err('参与人数已达上限！');
      // 校验 用户NT数
      const userAccount = await ctx.modelmysql.UserAccount.findOne({ where: { uid } });
      if (!userAccount || !userAccount.nt || Number(userAccount.nt) < treasure.nt_size) return this.err('NT值不足！');
      const nt_before = userAccount.nt;
      const nt_after = userAccount.nt - nt_size;
      // 兑换
      try {
        // 注册事务
        await ctx.modelmysql.transaction(
          { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
          async transaction => {
            // 创建兑换记录
            await ctx.modelmysql.TreasureRecord.create(
              { uid, treasure_id, nt_size, nt_before, nt_after },
              { transaction }
            );
            // 减少NT值
            await ctx.modelmysql.UserAccount.decrement(
              { nt: nt_size },
              { where: { uid }, transaction }
            );
          }
        );
      } catch (e) {
        return this.err('夺宝失败！');
      }
      this.success();
      app.logger.info(logPrefix, uid, 'success');
    }
  }
  return TreasureController;
};
