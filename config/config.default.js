/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1597130757528_7022';

  // csrf
  exports.security = {
    csrf: {
      enable: false,
    },
  };

  // add your middleware config here
  config.middleware = [ 'auth' ];
  config.auth = {
    enable: true,
    ignore: [ '/health' ],
  };

  // Mysql
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '*',
    timezone: '+08:00',
    database: '*',
    delegate: 'modelmysql',
    baseDir: 'modelmysql',
  };

  // MongoDB
  const db = {
    itong: {
      host: 'localhost:27017',
      dbName: 'itong',
      authSource: 'admin',
      userName: '*',
      password: '*',
    },
    test: {
      host: 'localhost:27017',
      dbName: 'test',
      authSource: 'admin',
      userName: '*',
      password: '*',
    },
  };
  config.mongoose = {
    clients: {
      itong: {
        url: `mongodb://${db.itong.userName}:${db.itong.password}@${db.itong.host}/${db.itong.dbName}`,
        options: {
          auth: { authSource: db.itong.authSource },
        },
      },
      test: {
        url: `mongodb://${db.test.userName}:${db.test.password}@${db.test.host}/${db.test.dbName}`,
        options: {
          auth: { authSource: db.test.authSource },
        },
      },
    },
  };

  // Redis
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: 'localhost', // Redis
      password: '*',
      db: 0,
    },
  };

  // Validator
  config.validator = {
    open: async ctx => 'zh-CN',
    languages: {
      'zh-CN': {
        required: '%s 必填',
      },
    },
    async formatter(ctx, error) {
      console.log(error);
      ctx.body = {
        code: '400',
        msg: error ? error[0].message : '',
        data: '',
      };
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
