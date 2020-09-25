'use strict';

const { Sequelize, Transaction } = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  schedule: {
    interval: '30m', // 30 minute interval
    type: 'all', // specify all `workers` need to execute
    immediate: true,
  },
  async task(ctx) {
    console.log('treasure schedule start!');
    const treasures = await ctx.modelmysql.Treasure.findAll({
      where: {
        state: 1,
        end_time: { [Op.lte]: Date.now() },
        is_alive: true,
      },
    });
    console.log('夺宝活动进行中数量', treasures.length);
    await Promise.all(treasures.map(async treasure => {
      const { id, nt_size, people_number } = treasure;
      // 查看参与人数
      const count = await ctx.modelmysql.TreasureRecord.count({ where: { treasure_id: id } });
      console.log('夺宝活动参与人数', `活动id:${id}`, `参与人数${count}`, `配置参与人数${people_number}`);
      try {
        // 注册事务
        await ctx.modelmysql.transaction(
          { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
          async transaction => {
            if (count < people_number) { // 活动失败 退回NT 修改活动状态
              const treasureRecords = await ctx.modelmysql.TreasureRecord.findAll({ where: { treasure_id: id }, transaction });
              treasureRecords.map(async treasureRecord => {
                const { uid } = treasureRecord;
                await ctx.modelmysql.UserAccount.increment({ nt: nt_size }, { where: { uid }, transaction });
              });
              await ctx.modelmysql.Treasure.update({ state: 2 }, { where: { id }, transaction });
            } else { // 活动成功 抽取幸运号 修改夺宝活动状态
              // 抽取幸运号
              const treasureRecord = await ctx.modelmysql.TreasureRecord.findAll({
                where: { treasure_id: id },
                attributes: [ 'id' ],
                transaction,
                order: [ Sequelize.fn('rand') ],
                limit: 1,
              });
              // 中奖号
              const luckNum = treasureRecord[0].id;
              console.log('夺宝幸运号', `活动id:${id}`, luckNum);
              // 更新中奖状态
              await ctx.modelmysql.TreasureRecord.update({ is_lucky: true }, { where: { id: luckNum }, transaction }); // 更新用户中奖状态
              await ctx.modelmysql.Treasure.update({ state: 3 }, { where: { id }, transaction }); // 更新活动状态
            }
          }
        );
      } catch (e) {
        console.error('夺宝活动状态更新失败！', `活动id:${id}`, e);
      }
    }));
    console.log('treasure schedule finish!');
  },
};
