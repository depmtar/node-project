'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;
  const db = app.modelmysql.define('pool_user_account', {
    uid: STRING,
    nt: STRING,
    nq: STRING,
    dor: STRING,
    eos: STRING,
    ltc: STRING,
    eth: STRING,
    btc: STRING,
    etc: STRING,
    usdt: STRING,
    dac: STRING,
    vdl: STRING,
    pe: STRING,
    fcb: STRING,
  });
  return db;
};
