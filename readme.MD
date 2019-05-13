# 云亲（cloudarling）

亲，你好。

我是用户通行证系统，提供注册，登录，获取基本信息等功能。

也提供简单权限管理。

同时也是 cloudeer 生态系统一员。



以下 api，如无特殊说明，均需要 ticket 参数。

open 接口里，ticket 随 form 或者 querystring 走。

admin 接口里，ticket 一律放到 querystring 中。

## 帐号 API

---

POST /open/account/login

登录


输入：passport （手机或者email，然后是用户名）, password, expires_in(可选)

如果登录成功则：

```json
    {
      "errno": 0,
      "data": {
        "ticket": "eyJvcGVuX2l...",
        "expires_in": 1440655749,
        "nick": "啤酒云"
      }
    }
```

ticket 是登录票据，之后的所有 api 将会依赖此票据，expires_in 表示这次登录即将失效的时间（时间戳，单位：秒），由客户端保存。

---

POST /open/account/check-passport
 
检查手机/email/nick是否被注册
 
参数：passport

---



POST /open/account/register

注册

参数：mobile, email, nick, password, expires_in




---


GET /open/account/info

获取用户信息

参数：ticket

---

GET /open/account/refresh-ticket

刷新 ticket

---

GET /open/account/rights

获取用户权限

上帝管理员将只获取一个权限，就是 GOD

参数： ticket，service

---

POST /open/account/change-password

修改密码

参数：ticket, password

---

POST /open/helper/captcha-send

发送动态密码


参数：passport

---

POST /open/helper/captcha-validate

验证动态密码


参数：passport, code

---



## 地区 API

以下 api 无需 ticket

---

GET:  /open/district/children

参数： id

这个API将获取当前id地区的亲生儿子

---


GET:  /open/district/family

参数： id

这个API将获取当前 id 的家族

包括：自己的兄弟，自己的儿子，自己的父亲和父亲的兄弟，爷爷和爷爷的兄弟，直系亲属将 使用 {selected: true} 标记出来。

---

GET:  /open/district/ancestor

参数： id

这个API将获取当前id向上递归的直系地区列表


---



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

---

GET:  /admin/account/list

帐号列表

输入： q （可选，查询条件，可以对 email nick 和 mobile 进行模糊查询）

---
POST: /admin/account/list-more

通过 open_id 数组获取用户列表。

```json
{
  "open_ids":[
    "3b28bae0-6d7a-11e9-8531-0242ac110002", 
    "4edddb44-749b-11e9-98cc-4e158326cc13"
  ]
}
```

---

POST: /admin/account/grant-god

---------

POST: /admin/account/save

---------

POST: /admin/right/edit-service

---------

POST: /admin/right/del-service

---------

GET:  /admin/right/list-service

---------

POST: /admin/right/edit-rights

---------

GET:  /admin/right/list-rights

权限列表

输入：service_id, title （可选，查询条件）

---------

POST: /admin/right/del-rights

---------

~~POST: /admin/right/grant~~

废弃，现在使用 role 关联

---------

~~POST: /admin/right/ungrant~~

给用户删除一个权限

废弃，现在使用 role 关联

---------

~~GET:  /admin/right/user-rights~~

废弃，现在使用 role 关联

---------

GET:  /admin/right/sync-from-cloudeer

从 cloudeer 中同步服务和方法

---------

GET: /admin/role/list 

角色列表

输入: q （可选，查询条件，查询角色名称）

------------

POST: /admin/role/save 

角色保存

输入: title， id(不输入是插入，输入是修改)

---------

POST: /admin/role/edit-user 

在角色中增加用户，或者给用户增加角色

输入: account_id, role_id, 如果存在就是删除，如果不存在就是增加。

---------

POST: /admin/role/edit-rights 

在角色中增加功能，或者将功能授权给角色

输入: account_id, rights_id, 如果存在就是删除，如果不存在就是增加。

---------




