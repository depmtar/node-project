'use strict';

module.exports = app => {
  class VersionManageService extends app.Service {

    /**
     * 处理筛选条件
     * @param {Object} filter 筛选条件
     * @author 张亮 liang.zhang@qingclass.com
     */
    async handleFilter(filter) {
      const { ctx } = this;
      if (filter.version) {
        const version = filter.version.split('.')
          .map(elem => {
            if (!elem) return '*';
            return Number(elem);
          }).join('.');
        filter.version = { $regex: `^${version}` };
      }
      filter._project = ctx.currProjectId;
      app.logger.info('App版本管理筛选', filter);
    }

    /**
     * 处理版本号
     * 1.补全版本号 规则：[主版本号].[次版本号].[修订版本号]  version：1 >>> 1.0 >>> 1.0.0
     * 2.存储主版本号、次版本号、修订版本号
     * @param {Object} data 版本更新管理信息
     * @author 张亮 liang.zhang@qingclass.com
     * @private
     */
    async _handleVersion(data) {
      const { ctx } = this;
      const elems = data.version.split('.').filter(elem => elem).map(elem => Number(elem));
      const length = elems.length;
      if (length < 3) {
        for (let len = 0; len < 3 - length; len++) { elems.push(0); }
      } else if (length > 3) throw ctx.createHttpError('版本号不符合规则！', 40000);
      data.version = elems.join('.');
      data.majorVerNum = elems[0];
      data.minorVerNum = elems[1];
      data.revisionVerNum = elems[2];
    }

    /**
     * 版本更新参数处理
     * @param {Object} data 版本更新数据
     * @author 张亮 liang.zhang@qingclass.com
     */
    async handleParams(data) {
      const { ctx } = this;
      const flag = !!ctx.params.id; // flag  true：编辑操作  false：新增操作

      // 校验参数
      const rule = {
        version: { type: 'string', required: true },
        statement: { type: 'string', required: true },
        device: { type: 'number', required: true },
      };
      const releaseTypeEnum = {
        fullRelease: 1,
        grayRelease: 2,
      };
      if (data.device && data.device === 1) {
        rule.apkFileUrl = { type: 'string', required: true };
        rule.releaseType = { type: 'number', required: true }; // android 发布类型
        if (data.releaseType === releaseTypeEnum.grayRelease) { // 灰度发布
          rule.grayReleaseNum = { type: 'number', min: 1, required: true }; // 灰度发布人数范围
        }
      }
      if (flag) rule.versionCode = { type: 'number', required: true };
      ctx.validate(rule, data);

      // 处理版本号
      await this._handleVersion(data);

      // 校验同一设备、同一版本号唯一
      const filter = { device: data.device, version: data.version };
      flag && (filter._id = { $ne: ctx.params.id });
      const versionCount = await ctx.model.VersionManage.count(filter);
      if (versionCount !== 0) throw ctx.createHttpError('该设备的版本号已存在，请修改！', 40000);

      // 记录android版本记录生效状态
      data.device === 1 && data.isAlive && (data.isValid = true);
      // 新增、编辑操作
      if (flag) {
        // 编辑操作
        const versionManage = await ctx.model.VersionManage.findById(ctx.params.id);
        if (data.device !== versionManage.device) throw ctx.createHttpError('设备类型不可修改！', 40000);
        if (data.versionCode !== versionManage.versionCode) throw ctx.createHttpError('设备版本编码不可修改！', 40000);
        if (versionManage.isValid && data.apkFileUrl !== versionManage.apkFileUrl) throw ctx.createHttpError('当前版本已上线过，不可更改apk下载地址！', 40000);
        if (versionManage.isValid && (!versionManage.releaseType || versionManage.releaseType === releaseTypeEnum.fullRelease) && data.releaseType === releaseTypeEnum.grayRelease) {
          throw ctx.createHttpError('全量发布下，不可修改为灰度发布! ', 40000);
        } else if (versionManage.isValid && data.releaseType === releaseTypeEnum.grayRelease && versionManage.grayReleaseNum > data.grayReleaseNum) {
          throw ctx.createHttpError('只能增加发布人数!', 40000);
        }
        // 版本更新记录首次生效时间 版本更新再次生效时间不重置
        (data.isAlive && !versionManage.effectiveTime) && (data.effectiveTime = Date.now());
      } else {
        // 新增操作 自增版本编码 初始值默认为2
        const versionManage = (await ctx.model.VersionManage.find({ device: data.device }, { versionCode: 1 }).sort({ versionCode: -1 }).limit(1))[0];
        data.versionCode = versionManage && versionManage.versionCode + 1 || 2;
        // 版本更新记录首次生效时间
        data.isAlive && (data.effectiveTime = Date.now());
      }
    }
    /**
     * 灰度发布更新为全量发布,删除redis用户版本控制id
     * @param {Object} versionManage 原始记录
     * @param {Number} releaseType (发布类型,生效状态)
     * @author 严祺 qi.yan@qingclass.com
     */
    async removeIDs(versionManage, releaseType) {
      const releaseTypeEnum = {
        fullRelease: 1,
        grayRelease: 2,
      };
      if (versionManage.releaseType !== releaseTypeEnum.grayRelease || !versionManage.isValid) return;
      if (releaseType === releaseTypeEnum.fullRelease && versionManage.id) {
        const keys = await app.redis.keys(`VERSION_MANAGE:${versionManage.id}*`);
        if (!keys.length) return;
        await app.redis.del(keys); // 删除该版本用户key,版本激活人数key
      }
    }
  }

  return VersionManageService;
};
