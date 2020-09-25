-- ----------------------------
-- Table structure for pool_user_accounts
-- ----------------------------
DROP TABLE IF EXISTS `pool_user_accounts`;
CREATE TABLE `pool_user_accounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) unsigned NOT NULL,
  `nt` decimal(20,8) DEFAULT '0.00000000',
  `nq` decimal(20,8) unsigned DEFAULT '0.00000000',
  `usdt` decimal(20,8) unsigned DEFAULT '0.00000000',
  `dor` decimal(20,8) DEFAULT '0.00000000',
  `eos` decimal(20,8) DEFAULT '0.00000000',
  `ltc` decimal(20,8) DEFAULT '0.00000000',
  `eth` decimal(20,8) DEFAULT '0.00000000',
  `btc` decimal(20,8) DEFAULT '0.00000000',
  `etc` decimal(20,8) DEFAULT '0.00000000',
  `dac` decimal(20,8) DEFAULT '0.00000000',
  `vdl` decimal(20,8) DEFAULT '0.00000000',
  `fcb` decimal(20,8) DEFAULT '0.00000000',
  `pe` decimal(20,8) DEFAULT '0.00000000',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uid` (`uid`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  KEY `nt` (`nt`) USING BTREE,
  KEY `nq` (`nq`) USING BTREE,
  KEY `usdt` (`usdt`) USING BTREE,
  KEY `idx_uid_nt` (`uid`,`nt`),
  CONSTRAINT `pool_user_accounts_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `pool_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=741563 DEFAULT CHARSET=utf8 COMMENT='用户账户表';

-- ----------------------------
-- Table structure for pool_treasures
-- ----------------------------
DROP TABLE IF EXISTS `pool_treasures`;
CREATE TABLE `pool_treasures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '夺宝活动Icon',
  `icon_url` varchar(100) NOT NULL COMMENT '夺宝活动Icon',
  `content` varchar(255) NOT NULL COMMENT '描述',
  `price` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `people_number` int(11) NOT NULL DEFAULT 1 COMMENT '参与人数',
  `nt_size` decimal(20,0) NOT NULL COMMENT 'nt数量',
  `state` int(1) NOT NULL DEFAULT 1 COMMENT '活动状态 1:进行中 2:失败 3:成功揭晓',
  `is_alive` tinyint(4) DEFAULT 1 COMMENT '活动是否有效 0失效 1生效',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='夺宝活动';

-- ----------------------------
-- Table structure for pool_treasure_records
-- ----------------------------
DROP TABLE IF EXISTS `pool_treasure_records`;
CREATE TABLE `pool_treasure_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '幸运号',
  `uid` bigint(20) NOT NULL COMMENT '用户Id',
  `treasure_id` int(11) NOT NULL COMMENT '夺宝活动Id',
  `nt_size` decimal(20,8) NOT NULL COMMENT 'nt数量',
  `nt_before` decimal(20,8) NOT NULL COMMENT 'nt数量',
  `nt_after` decimal(20,8) NOT NULL COMMENT 'nt数量',
  `is_lucky` tinyint(4) DEFAULT 0 COMMENT '是否中奖 0未中奖 1中奖',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`) USING BTREE,
   UNIQUE KEY `idx_uid_treasure_id` (`uid`,`treasure_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='夺宝记录';
