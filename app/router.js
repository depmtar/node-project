'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/health', controller.home.index);

  // 夺宝管理台
  router.resources('adminTreasures', '/admin/api/treasures', controller.adminTreasure);

  // 夺宝
  router.get('/api/v1/treasures/list', controller.treasure.list); // 列表
  router.post('/api/v1/treasures/join', controller.treasure.join); // 详情
  router.post('/api/v1/treasures/exchange', controller.treasure.exchange); // 兑换

  // -------- APP版本更新管理 ----------
  app.resources('versionManages', '/api/tools/versionManages', app.controller.versionManage);
};
