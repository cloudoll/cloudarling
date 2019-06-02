

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


drop TRIGGER IF EXISTS before_insert_tenant;

DELIMITER ;;
CREATE TRIGGER before_insert_tenant
BEFORE INSERT ON tenant
FOR EACH ROW
BEGIN
  IF new.open_id IS NULL THEN
    SET new.open_id = uuid();
  END IF;
END
;;





CREATE OR REPLACE VIEW v_user_rights AS
select
d.id, d.title title,d.code code,d.service_id service_id, a.id account_id
from account a
inner join user_role b on a.id=b.account_id
inner join role_rights c on b.role_id=c.role_id
inner join rights d on c.rights_id=d.id
;


CREATE OR REPLACE VIEW v_tenant_account as
  select `tenant_account`.`id`, `tenant_account`.`account_type`, `tenant_account`.`account_status`, 
    `tenant_account`.`create_date`, `tenant_account`.`creator`, `tenant_account`.`account_id`, 
    `tenant_account`.`tenant_id`, `tenant_account`.`permission`, 
    `tenant`.`tenant_type`, `tenant`.`tenant_status`, `tenant`.`title`, `tenant`.`title2`, 
    `tenant`.`domain`, `tenant`.`grade`, `tenant`.`fake_name`, `tenant`.`open_id` AS `tenant_open_id`, 
    `tenant`.`title_short`, 
    `account`.`mobile`, `account`.`email`, `account`.`nick`, `account`.`gender`, 
    `account`.`balance`, `account`.`vbalance`, `account`.`score`, `account`.`alt_email`, 
    `account`.`avatar`, `account`.`avatar_large`, `account`.`slogan`, `account`.`open_id`
  from `tenant_account` 
  left join `tenant` on `tenant_account`.`tenant_id` =  `tenant`.`id`
  left join `account` on `tenant_account`.`account_id` =  `account`.`id`
  ;


CREATE OR REPLACE VIEW v_account_map as
  select 
    `account`.`mobile`, `account`.`email`, `account`.`nick`, `account`.`gender`, 
    `account`.`avatar`, `account`.`avatar_large`, `account`.`slogan`, `account`.`open_id`,
    `provider`, `map_id`, `account_map`.`id`, `account_map`.`account_id`
  from `account_map`
  left join `account` on `account`.`id` = `account_map`.`account_id`
  ;