'use strict';

module.exports = app => {
  const { STRING, DATE, DECIMAL, BOOLEAN, INTEGER, NOW } = app.Sequelize;
  const db = app.modelmysql.define('pool_treasures', {
    name: STRING, // 夺宝活动名称
    icon_url: STRING, // 夺宝Icon
    content: STRING, // 描述
    price: DECIMAL, // 价格
    start_time: DATE, // 开始时间
    end_time: DATE, // 结束时间
    people_number: INTEGER, // 参与人数
    nt_size: INTEGER, // 消耗NT数
    state: INTEGER, // 活动状态
    is_alive: BOOLEAN, // 活动是否有效
  });
  return db;
};
