'use strict';

module.exports = app => {
  class VersionManageController extends app.Controller {

    /**
     * APP版本管理列表
     * @author 张亮 liang.zhang@qingclass.com
     */
    async index() {
      const { ctx } = this;
      const logPrefix = 'APP版本管理列表';
      const query = ctx.request.query;
      const { pageNumber, pageSize, filter } = await ctx.service.util.handleQuery(query);
      await ctx.service.versionManage.handleFilter(filter);
      const [ items, total ] = await Promise.all([
        ctx.model.VersionManage.find(filter)
          .sort({ majorVerNum: -1, minorVerNum: -1, revisionVerNum: -1, device: -1 })
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize),
        ctx.model.VersionManage.count(filter),
      ]);
      ctx.body = { items, total };
      await ctx.service.util.log(logPrefix, filter, 'success', 'info');
    }

    /**
     * APP版本管理详情
     * @author 张亮 liang.zhang@qingclass.com
     */
    async show() {
      const { ctx } = this;
      const logPrefix = 'APP版本管理详情';
      const item = await ctx.model.VersionManage.findById(ctx.params.id);
      ctx.body = { item };
      await ctx.service.util.log(logPrefix, ctx.params, 'success', 'info');
    }

    /**
     * 新增APP版本管理
     * @author 张亮 liang.zhang@qingclass.com
     */
    async create() {
      const { ctx } = this;
      const logPrefix = '新增APP版本管理';
      const data = ctx.request.body;

      // 处理参数
      await ctx.service.versionManage.handleParams(data);
      data._project = ctx.currProjectId;

      const versionManage = new ctx.model.VersionManage(data);
      const item = await versionManage.save();
      ctx.body = { item };
      await ctx.service.util.log(logPrefix, data, 'success', 'info');
    }

    /**
     * 更新APP版本管理
     * @author 张亮 liang.zhang@qingclass.com
     */
    async update() {
      const { ctx } = this;
      const logPrefix = '更新APP版本管理';
      const data = ctx.request.body;
      const versionManage = await ctx.model.VersionManage.findById(ctx.params.id);
      if (!versionManage) throw ctx.createHttpError('该APP版本管理记录不存在！', 40000);
      // 处理参数
      await ctx.service.versionManage.handleParams(data);
      const item = await ctx.model.VersionManage.findByIdAndUpdate(ctx.params.id, { $set: data }, { new: true });
      ctx.body = { item };
      await ctx.service.versionManage.removeIDs(versionManage, data.releaseType); // 若切换为全量，删除灰度发布ID
      await ctx.service.util.log(logPrefix, Object.assign(data, ctx.params), 'success', 'info');
    }
  }

  return VersionManageController;
};
