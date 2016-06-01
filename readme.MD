# 云亲（cloudarling）

亲，你好。

我是用户通行证系统，提供注册，登录，获取基本信息等功能。

也提供简单权限管理。

同时也是 cloudeer 生态系统一员。


## 用户 API

### 注册

POST /register

参数：mobile, email, nick, password


### 登录

POST /login

参数：passport, password

### 检查手机/email/nick是否被注册

POST /check-passport

参数：passport

### 获取用户信息

GET /info

参数：ticket


### 修改密码

POST /change-password

参数：ticket, password

### 发送动态密码

POST /dynamic-password/send

参数：passport

### 使用动态密码登录

POST /dynamic-password/login

参数：passport, password, ticket

此处提交的 ticket 是发送动态密码时候由服务器端返回的，不是用户票据。


### 获取用户权限

GET /rights

参数： ticket，service



## 管理 API

一下组的 api 需要 cloudarling 中用户的 GOD_ADMIN 权限。

### 查询用户

GET /admin/accounts

参数：ticket, keyword，skip， limit


### 服务列表

GET /admin/services


### 从 cloudeer 中同步方法

GET /admin/service/sync

参数 ticket

从 cloudeer 中同步方法，以便进行权限管理




### 删除服务

POST /admin/service/delete

参数 ticket，id



### 新增或者修改服务

POST /admin/serivce/save

参数：

```
{
    id: 0 || 10,
    code: 'cloudarling',
    title: 'xxx',
    content: 'xxxxx'
}
```

如果传了 id，并且不为 0，则是新增！


