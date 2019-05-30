
DROP TABLE IF EXISTS account;
CREATE TABLE `account` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY ,
	`mobile` VARCHAR (20) NULL ,
	`email` VARCHAR (500) NULL ,
	`nick` VARCHAR (50) NULL ,
	`salt` VARCHAR (16) NULL ,
	`password` VARCHAR (64) NULL ,
	`gender` INT NULL DEFAULT 0 ,
	`balance` DECIMAL (18,4) NULL DEFAULT 0.0000 ,
	`vbalance` DECIMAL (18,4) NULL DEFAULT 0.0000 ,
	`score` INT NULL DEFAULT 0 ,
	`alt_email` VARCHAR (300) NULL ,
	`avatar` VARCHAR (300) NULL ,
	`avatar_large` VARCHAR (300) NULL ,
	`slogan` VARCHAR (500) NULL ,
	`account_type` INT NULL DEFAULT 1 ,
	`account_status` INT NULL DEFAULT 1 ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 ,
	`update_date` TIMESTAMP NULL ,
	`updater` BIGINT (20) NULL ,
	`open_id` CHAR (36) NULL 
);

DROP TABLE IF EXISTS `account_log`;
CREATE TABLE `account_log` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`title` VARCHAR (300) NULL ,
	`ip` VARCHAR (64) NULL ,
	`account_id` BIGINT (20) NULL DEFAULT 0 ,
	`log_type` BIGINT (20) NULL ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 
);

DROP TABLE IF EXISTS `account_map`;
CREATE TABLE `account_map` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`account_id` BIGINT (20) NULL ,
	`open_id` VARCHAR (64) NULL ,
	`map_id` VARCHAR (64) NULL ,
	`provider` VARCHAR (50) NULL ,
	`last_ip` VARCHAR (64) NULL ,
	`login_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`district_id` INT NULL DEFAULT 0 ,
	`district` VARCHAR (100) NULL ,
	`postcode` VARCHAR (10) NULL ,
	`address` VARCHAR (500) NULL ,
	`cnee` VARCHAR (50) NULL ,
	`tel1` VARCHAR (20) NULL ,
	`tel2` VARCHAR (20) NULL ,
	`im` VARCHAR (300) NULL ,
	`account_id` BIGINT (20) NULL DEFAULT 0 ,
	`address_type` INT NULL DEFAULT 1 ,
	`address_status` INT NULL DEFAULT 1 ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 ,
	`update_date` TIMESTAMP NULL ,
	`updater` BIGINT (20) NULL 
);

DROP TABLE IF EXISTS `area`;
CREATE TABLE `area` (
	`id` INT PRIMARY KEY ,
	`title` VARCHAR (300) NOT NULL ,
	`parent_id` INT NULL ,
	`short_name` VARCHAR (30) NULL ,
	`area_code` INT NULL ,
	`zip_code` INT NULL ,
	`pinyin` VARCHAR (100) NULL ,
	`lng` VARCHAR (20) NULL ,
	`lat` VARCHAR (20) NULL ,
	`level` INT NOT NULL ,
	`position` VARCHAR (255) NULL ,
	`sort` INT NULL 
);

DROP TABLE IF EXISTS `device`;
CREATE TABLE `device` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`title` VARCHAR (300) NULL ,
	`sn` VARCHAR (100) NULL ,
	`mac` VARCHAR (20) NULL ,
	`code` VARCHAR (100) NULL ,
	`account_id` BIGINT (20) NULL DEFAULT 0 ,
	`device_type` INT NULL DEFAULT 1 ,
	`device_status` INT NULL DEFAULT 1 ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 ,
	`update_date` TIMESTAMP NULL ,
	`updater` BIGINT (20) NULL 
);

DROP TABLE IF EXISTS `district`;
CREATE TABLE `district` (
	`id` INT PRIMARY KEY ,
	`title` VARCHAR (300) NULL ,
	`postcode` VARCHAR (10) NULL ,
	`code` VARCHAR (20) NULL ,
	`parent_id` INT NULL DEFAULT 0 ,
	`district_type` INT NULL DEFAULT 1 ,
	`district_status` INT NULL DEFAULT 1 ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 ,
	`update_date` TIMESTAMP NULL ,
	`updater` BIGINT (20) NULL 
);

DROP TABLE IF EXISTS `rights`;
CREATE TABLE `rights` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`code` VARCHAR (500) NULL ,
	`title` VARCHAR (300) NULL ,
	`rights_type` INT NULL DEFAULT 1 ,
	`rights_status` INT NULL DEFAULT 1 ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 ,
	`update_date` TIMESTAMP NULL ,
	`updater` BIGINT (20) NULL ,
	`service_id` INT NULL DEFAULT 0 
);

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`title` VARCHAR (50) NOT NULL ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 
);

DROP TABLE IF EXISTS `role_rights`;
CREATE TABLE `role_rights` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`rights_id` BIGINT (20) NULL ,
	`role_id` INT NULL ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 
);

DROP TABLE IF EXISTS `service`;
CREATE TABLE `service` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`code` VARCHAR (50) NULL ,
	`title` VARCHAR (300) NULL ,
	`content` VARCHAR (1000) NULL ,
	`service_type` INT NULL DEFAULT 1 ,
	`service_status` INT NULL DEFAULT 1 ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 ,
	`update_date` TIMESTAMP NULL ,
	`updater` BIGINT (20) NULL 
);

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`idcard` VARCHAR (40) NULL ,
	`last_name` VARCHAR (30) NULL ,
	`first_name` VARCHAR (20) NULL ,
	`qq` VARCHAR (100) NULL ,
	`info_status` INT NULL DEFAULT 1 ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 ,
	`update_date` TIMESTAMP NULL ,
	`updater` BIGINT (20) NULL ,
	`link` VARCHAR (500) NULL 
);

DROP TABLE IF EXISTS `user_rights`;
CREATE TABLE `user_rights` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`account_id` BIGINT (20) NULL DEFAULT 0 ,
	`rights_id` INT NULL DEFAULT 0 ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 
);

DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
	`id` BIGINT (20) AUTO_INCREMENT PRIMARY KEY ,
	`account_id` BIGINT (20) NULL ,
	`role_id` INT NULL ,
	`create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`creator` BIGINT (20) NULL DEFAULT 0 
);

DROP TABLE IF EXISTS `tenant`;
CREATE TABLE `tenant` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY ,
	`tenant_type` INT NULL DEFAULT 1 ,
	`tenant_status` INT NULL DEFAULT 1 ,
	`create_date` TIMESTAMP NULL DEFAULT  CURRENT_TIMESTAMP ,
	`creator` BIGINT NULL ,
	`update_date` TIMESTAMP NULL ,
	`updater` BIGINT NULL ,
	`title` VARCHAR (300) NOT NULL ,
	`title2` VARCHAR (300) NULL ,
	`domain` VARCHAR (100) NULL ,
	`grade` BIGINT NULL DEFAULT 0 ,
	`fake_name` VARCHAR (100) NULL ,
	`open_id` CHAR (36) NULL ,
	`title_short` VARCHAR (50) NULL 
);

DROP TABLE IF EXISTS `tenant_account`;
CREATE TABLE `tenant_account` (
	`id` BIGINT AUTO_INCREMENT PRIMARY KEY ,
	`account_type` INT NULL DEFAULT 1 ,
	`account_status` INT NULL DEFAULT 1 ,
	`create_date` TIMESTAMP NULL DEFAULT  CURRENT_TIMESTAMP ,
	`creator` BIGINT NULL ,
	`account_id` BIGINT NULL DEFAULT 0 ,
	`tenant_id` BIGINT NULL DEFAULT 0 ,
	`permission` BIGINT NULL DEFAULT 0 
);

