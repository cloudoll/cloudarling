CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS account
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    mobile character varying(20) UNIQUE,
    email character varying(500) UNIQUE,
    nick character varying(50) UNIQUE,
    salt character varying(16),
    password character varying(64) ,
    gender integer DEFAULT 0,
    youku_id bigint DEFAULT 0,
    qq_id character varying(64) ,
    weibo_id bigint DEFAULT 0,
    wechat_id character varying(64) ,
    ding_id  character varying(64) ,
    balance numeric DEFAULT 0,
    vbalance numeric DEFAULT 0,
    score integer DEFAULT 0,
    alt_email character varying(300) ,
    avatar character varying(300) ,
    avatar_large character varying(300) ,
    slogan character varying(500) ,
    account_type integer DEFAULT 1,
    account_status integer DEFAULT 1,
    create_date timestamp without time zone DEFAULT now(),
    creator bigint,
    update_date timestamp without time zone,
    updater bigint,
    open_id uuid DEFAULT uuid_generate_v1()
);


CREATE TABLE IF NOT EXISTS account_log
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title character varying(300) ,
    ip character varying(64) ,
    account_id bigint DEFAULT 0,
    log_type bigint,
    create_date timestamp without time zone DEFAULT now(),
    creator bigint
);

CREATE TABLE IF NOT EXISTS address
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    district_id integer DEFAULT 0,
    district character varying(100) ,
    postcode character varying(10) ,
    address character varying(500) ,
    cnee character varying(50) ,
    tel1 character varying(20) ,
    tel2 character varying(20) ,
    im character varying(300) ,
    account_id bigint DEFAULT 0,
    address_type integer DEFAULT 1,
    address_status integer DEFAULT 1,
    create_date timestamp without time zone DEFAULT now(),
    creator bigint,
    update_date timestamp without time zone,
    updater bigint
);

CREATE TABLE IF NOT EXISTS device
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title character varying(300) ,
    sn character varying(100) ,
    mac character varying(20) ,
    code character varying(100) ,
    account_id bigint DEFAULT 0,
    device_type integer DEFAULT 1,
    device_status integer DEFAULT 1,
    create_date timestamp without time zone DEFAULT now(),
    creator bigint,
    update_date timestamp without time zone,
    updater bigint
);


CREATE TABLE IF NOT EXISTS district
(
    id integer NOT NULL PRIMARY KEY,
    title character varying(300) ,
    postcode character varying(10) ,
    code character varying(20) ,
    parent_id integer DEFAULT 0,
    district_type integer DEFAULT 1,
    district_status integer DEFAULT 1,
    create_date timestamp without time zone DEFAULT now(),
    creator bigint,
    update_date timestamp without time zone,
    updater bigint
);

CREATE TABLE IF NOT EXISTS rights
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    code character varying(500) ,
    title character varying(300) ,
    rights_type integer DEFAULT 1,
    rights_status integer DEFAULT 1,
    create_date timestamp without time zone DEFAULT now(),
    creator bigint,
    update_date timestamp without time zone,
    updater bigint,
    service_id integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS service
(
    id SERIAL NOT NULL PRIMARY KEY,
    code character varying(50) ,
    title character varying(300) ,
    content character varying(1000) ,
    service_type integer DEFAULT 1,
    service_status integer DEFAULT 1,
    create_date timestamp without time zone DEFAULT now(),
    creator bigint,
    update_date timestamp without time zone,
    updater bigint
);

CREATE TABLE IF NOT EXISTS user_info
(
    id BIGSERIAL NOT NULL  PRIMARY KEY,
    idcard character varying(40) ,
    last_name character varying(30) ,
    first_name character varying(20) ,
    qq character varying(100) ,
    info_status integer DEFAULT 1,
    create_date timestamp without time zone DEFAULT now(),
    creator bigint,
    update_date timestamp without time zone,
    updater bigint,
    link character varying(500)
);

CREATE TABLE IF NOT EXISTS user_rights
(
    id BIGSERIAL NOT NULL  PRIMARY KEY,
    account_id bigint DEFAULT 0,
    rights_id integer DEFAULT 0,
    create_date timestamp without time zone DEFAULT now(),
    creator bigint
);

CREATE TABLE IF NOT EXISTS account_map
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    account_id bigint,
    open_id character varying(64),
    map_id character varying(64) ,
    provider character varying(50),
    last_ip character varying(64) ,
    login_time timestamp without time zone,
    create_date timestamp without time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS area
(
  id integer  NOT NULL PRIMARY KEY,
  title character varying(30) NOT NULL,
  parent_id integer,
  short_name character varying(30),
  area_code integer,
  zip_code integer,
  pinyin character varying(100),
  lng character varying(20),
  lat character varying(20),
  level integer NOT NULL,
  "position" character varying(255),
  sort integer
);



--CREATE OR REPLACE VIEW v_user_rights AS
-- SELECT user_rights.id,
--    user_rights.account_id,
--    user_rights.rights_id,
--    user_rights.create_date,
--    user_rights.creator,
--    rights.title,
--    rights.code,
--    rights.service_id
--   FROM user_rights
--     LEFT JOIN rights ON user_rights.rights_id = rights.id;




--updated @ 2016年08月08日
CREATE TABLE IF NOT EXISTS role
(
  id SERIAL NOT NULL PRIMARY KEY,
  title character varying(50) NOT NULL,
  create_date timestamp without time zone DEFAULT now(),
  creator bigint
);

CREATE TABLE IF NOT EXISTS role_rights
(
  id SERIAL NOT NULL PRIMARY KEY,
  rights_id bigint,
  role_id integer,
  create_date timestamp without time zone DEFAULT now(),
  creator bigint
);

CREATE TABLE IF NOT EXISTS user_role
(
  id BIGSERIAL NOT NULL PRIMARY KEY,
  account_id bigint,
  role_id integer,
  create_date timestamp without time zone DEFAULT now(),
  creator bigint
);

drop view if exists v_user_rights;

CREATE OR REPLACE VIEW public.v_user_rights AS
select
d.id, d.title title,d.code code,d.service_id service_id, a.id account_id
from account a
inner join user_role b on a.id=b.account_id
inner join role_rights c on b.role_id=c.role_id
inner join rights d on c.rights_id=d.id



