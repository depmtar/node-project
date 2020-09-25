'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  validator: {
    enable: true,
    package: 'egg-y-validator',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  // cors: {
  //   enable: true,
  //   package: 'egg-cors',
  // },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
};
