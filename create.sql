DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(45) NOT NULL,
  `user_name` varchar(45) DEFAULT NULL COMMENT '用户名',
  `nick` varchar(45) DEFAULT NULL COMMENT '昵称',
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL COMMENT '密码',
  `salt` varchar(36) DEFAULT NULL COMMENT '盐',
  `slogan` varchar(500) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `avatar_large` varchar(200) DEFAULT NULL,
  `account_type` int(11) DEFAULT '0' COMMENT '用户类型',
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `last_ip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `open_id_UNIQUE` (`open_id`),
  UNIQUE KEY `mobile_UNIQUE` (`mobile`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `nick_UNIQUE` (`nick`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




DROP TABLE IF EXISTS `account_map`;

CREATE TABLE `account_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(45) DEFAULT NULL,
  `map_id` varchar(45) DEFAULT NULL,
  `provider` varchar(45) DEFAULT NULL COMMENT '提供者，如 wechat, Weib 等',
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_ip` varchar(20) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `account_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `account_right`;

CREATE TABLE `account_right` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `right_id` int(11) NOT NULL,
  `creator` int(11) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `right`;

CREATE TABLE `right` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(500) NOT NULL DEFAULT '',
  `title` varchar(50) NOT NULL DEFAULT '',
  `service_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




DROP TABLE IF EXISTS `service`;

CREATE TABLE `service` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL DEFAULT '',
  `title` varchar(50) NOT NULL DEFAULT '',
  `content` varchar(500) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;



DROP VIEW IF EXISTS `v_account_right`;

CREATE VIEW `v_account_right`
AS SELECT
   `account_right`.`id` AS `id`,
   `account_right`.`account_id` AS `account_id`,
   `account_right`.`right_id` AS `right_id`,
   `right`.`title` AS `title`,
   `right`.`code` AS `code`,
   `right`.`service_id` AS `service_id`,
   `account_right`.`create_date` AS `create_date`,
   `account_right`.`creator` AS `creator`
FROM (`account_right` left join `right` on((`account_right`.`right_id` = `right`.`id`)));

