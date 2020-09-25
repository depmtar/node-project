'use strict';
module.exports = app => {

  const mongoose = app.mongoose;
  const pandora = app.mongooseDB.get('itong');
  const { ObjectId } = mongoose.Schema.Types;
  const VersionManageSchema = new mongoose.Schema({
    // 版本号 [主版本号].[次版本号].[修订版本号]
    version: { type: String, required: true },
    // 主版本号
    majorVerNum: { type: Number, required: true },
    // 次版本号
    minorVerNum: { type: Number, required: true },
    // 修订版本号
    revisionVerNum: { type: Number, required: true },
    // 版本编码
    versionCode: { type: Number, required: false },
    // 更新说明
    statement: { type: String, required: true },
    // 是否强制更新
    isForce: { type: Boolean, default: false },
    // 设备名称 1：ANDROID 2：IOS
    device: { type: Number, enum: [ 1, 2 ] },
    // 发布类型 1：全量发布 2：灰度发布
    releaseType: { type: Number, enum: [ 1, 2 ] },
    // 灰度发布人数量
    grayReleaseNum: { type: Number, required: false },
    // Android下载地址
    apkFileUrl: { type: String, required: false },
    // 版本更新管理所属项目
    _project: { type: ObjectId, ref: 'Project' },
    // 是否上线过 上线过的版本 apkFileUrl地址不可以更改
    isValid: { type: Boolean, default: false },
    // 生效时间
    effectiveTime: { type: Number },
    // 状态 是否生效
    isAlive: { type: Boolean, default: false },
    createTime: { type: Number, default: Date.now },
    updateTime: { type: Number, default: Date.now },
  });

  const updateHook = function() {
    if (this.options.overwrite) {
      this._update.updateTime = Date.now();
    } else {
      this._update.$set = this._update.$set || {};
      this._update.$set.updateTime = Date.now();
    }
  };

  VersionManageSchema.pre('findOneAndUpdate', updateHook);
  VersionManageSchema.pre('update', updateHook);

  return pandora.model('VersionManage', VersionManageSchema);
};
