# 云亲（cloudarling）

亲，你好。

我是用户通行证系统，提供注册，登录，获取基本信息等功能。

也提供简单权限管理。

同时也是 cloudeer 生态系统一员。


## API

### 注册

POST /register

参数：mobile, email, nick, password

### 获取用户信息

GET /info

参数：ticket

### 登录

POST /login

参数：passport, password

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