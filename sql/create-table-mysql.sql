CREATE TABLE IF NOT EXISTS account
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mobile varchar(20) UNIQUE,
    email varchar(500) UNIQUE,
    nick varchar(50) UNIQUE,
    salt varchar(16),
    password varchar(64) ,
    gender int DEFAULT 0,
    youku_id bigint DEFAULT 0,
    qq_id varchar(64) ,
    weibo_id bigint DEFAULT 0,
    wechat_id varchar(64) ,
    ding_id  varchar(64) ,
    balance decimal(18,4) DEFAULT 0,
    vbalance decimal(18,4) DEFAULT 0,
    score int DEFAULT 0,
    alt_email varchar(300) ,
    avatar varchar(300) ,
    avatar_large varchar(300) ,
    slogan varchar(500) ,
    account_type int DEFAULT 1,
    account_status int DEFAULT 1,
    create_date timestamp  DEFAULT now(),
    creator bigint default 0,
    update_date timestamp null ,
    updater bigint,
    open_id char(36)
);

drop TRIGGER IF EXISTS before_insert_account;

DELIMITER ;;
CREATE TRIGGER before_insert_account
BEFORE INSERT ON account
FOR EACH ROW
BEGIN
  IF new.open_id IS NULL THEN
    SET new.open_id = uuid();
  END IF;
END
;;

CREATE TABLE IF NOT EXISTS account_log
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title varchar(300) ,
    ip varchar(64) ,
    account_id bigint DEFAULT 0,
    log_type bigint,
    create_date timestamp  DEFAULT now(),
    creator bigint default 0
);

CREATE TABLE IF NOT EXISTS address
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district_id int DEFAULT 0,
    district varchar(100) ,
    postcode varchar(10) ,
    address varchar(500) ,
    cnee varchar(50) ,
    tel1 varchar(20) ,
    tel2 varchar(20) ,
    im varchar(300) ,
    account_id bigint DEFAULT 0,
    address_type int DEFAULT 1,
    address_status int DEFAULT 1,
    create_date timestamp  DEFAULT now(),
    creator bigint default 0,
    update_date timestamp null ,
    updater bigint
);

CREATE TABLE IF NOT EXISTS device
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title varchar(300) ,
    sn varchar(100) ,
    mac varchar(20) ,
    code varchar(100) ,
    account_id bigint DEFAULT 0,
    device_type int DEFAULT 1,
    device_status int DEFAULT 1,
    create_date timestamp  DEFAULT now(),
    creator bigint default 0,
    update_date timestamp null ,
    updater bigint
);


CREATE TABLE IF NOT EXISTS district
(
    id int NOT NULL PRIMARY KEY,
    title varchar(300) ,
    postcode varchar(10) ,
    code varchar(20) ,
    parent_id int DEFAULT 0,
    district_type int DEFAULT 1,
    district_status int DEFAULT 1,
    create_date timestamp  DEFAULT now(),
    creator bigint default 0,
    update_date timestamp null ,
    updater bigint
);

CREATE TABLE IF NOT EXISTS rights
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code varchar(500) ,
    title varchar(300) ,
    rights_type int DEFAULT 1,
    rights_status int DEFAULT 1,
    create_date timestamp  DEFAULT now(),
    creator bigint default 0,
    update_date timestamp null ,
    updater bigint,
    service_id int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS service
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code varchar(50) ,
    title varchar(300) ,
    content varchar(1000) ,
    service_type int DEFAULT 1,
    service_status int DEFAULT 1,
    create_date timestamp  DEFAULT now(),
    creator bigint default 0,
    update_date timestamp null ,
    updater bigint
);

CREATE TABLE IF NOT EXISTS user_info
(
    id BIGINT AUTO_INCREMENT  PRIMARY KEY,
    idcard varchar(40) ,
    last_name varchar(30) ,
    first_name varchar(20) ,
    qq varchar(100) ,
    info_status int DEFAULT 1,
    create_date timestamp  DEFAULT now(),
    creator bigint default 0,
    update_date timestamp null ,
    updater bigint,
    link varchar(500)
);

CREATE TABLE IF NOT EXISTS user_rights
(
    id BIGINT AUTO_INCREMENT  PRIMARY KEY,
    account_id bigint DEFAULT 0,
    rights_id int DEFAULT 0,
    create_date timestamp  DEFAULT now(),
    creator bigint default 0
);

CREATE TABLE IF NOT EXISTS account_map
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id bigint,
    open_id varchar(64),
    map_id varchar(64) ,
    provider varchar(50),
    last_ip varchar(64) ,
    login_time timestamp ,
    create_date timestamp  DEFAULT now()
);

CREATE TABLE IF NOT EXISTS area
(
  id int  NOT NULL PRIMARY KEY,
  title varchar(30) NOT NULL,
  parent_id int,
  short_name varchar(30),
  area_code int,
  zip_code int,
  pinyin varchar(100),
  lng varchar(20),
  lat varchar(20),
  `level` int NOT NULL,
  position varchar(255),
  sort int
);





CREATE TABLE IF NOT EXISTS role
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title varchar(50) NOT NULL,
  create_date timestamp  DEFAULT now(),
  creator bigint default 0
);

CREATE TABLE IF NOT EXISTS role_rights
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  rights_id bigint,
  role_id int,
  create_date timestamp  DEFAULT now(),
  creator bigint default 0
);

CREATE TABLE IF NOT EXISTS user_role
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  account_id bigint,
  role_id int,
  create_date timestamp  DEFAULT now(),
  creator bigint default 0
);

drop view if exists v_user_rights;

CREATE OR REPLACE VIEW v_user_rights AS
select
d.id, d.title title,d.code code,d.service_id service_id, a.id account_id
from account a
inner join user_role b on a.id=b.account_id
inner join role_rights c on b.role_id=c.role_id
inner join rights d on c.rights_id=d.id



