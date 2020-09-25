'use strict';

module.exports = app => {
  const { DECIMAL, BOOLEAN, INTEGER } = app.Sequelize;
  const db = app.modelmysql.define('pool_treasure_records', {
    uid: INTEGER, // 用户Id
    treasure_id: INTEGER, // 商品Id
    nt_size: DECIMAL,
    nt_before: DECIMAL,
    nt_after: DECIMAL,
    is_lucky: BOOLEAN, // 是否中奖
  });
  return db;
};
