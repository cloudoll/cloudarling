# 云亲（cloudarling）

亲，你好。

我是用户通行证系统，提供注册，登录，获取基本信息等功能。

也提供简单权限管理。

同时也是 cloudeer 生态系统一员。


## 帐号 API

### 注册

POST /open/account/register

参数：mobile, email, nick, password


### 登录

POST /open/account/login

参数：passport, password

### 检查手机/email/nick是否被注册

POST /open/account/check-passport

参数：passport

### 获取用户信息

GET /open/account/info

参数：ticket

### 刷新 ticket

GET /open/account/refresh-ticket


### 获取用户权限

GET /open/account/rights

参数： ticket，service

### 修改密码

POST /open/account/change-password

参数：ticket, password

### 发送动态密码

POST /open/helper/captcha-send

参数：passport

### 验证动态密码

POST /open/helper/captcha-validate

参数：passport, code




## 地区 API

GET:  /open/district/children

GET:  /open/district/family

GET:  /open/district/ancestor




## 地址 API

POST: /open/address/add

POST: /open/address/update

POST: /open/address/delete

POST: /open/address/set-default

GET:  /open/address/list

GET:  /open/address/default

GET:  /open/address/one



## 管理 API

以下的 api 需要 cloudarling 中用户的 GOD_ADMIN 权限。

GET:  /admin/account/list

POST: /admin/account/grant-god

POST: /admin/account/save

POST: /admin/right/edit-service

POST: /admin/right/del-service

GET:  /admin/right/list-service

POST: /admin/right/edit-rights

GET:  /admin/right/list-rights

POST: /admin/right/del-rights

POST: /admin/right/grant

POST: /admin/right/ungrant

GET:  /admin/right/user-rights

GET:  /admin/right/sync-from-cloudeer

