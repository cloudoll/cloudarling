var db       = require('ezway2mysql');
var tools    = require('common-tools');
var errors = require('clouderr').errors;
var myTools  = require('../tools');
var config   = require('../config');

var Account = {
  register              : function *(regInfo) {
    if (regInfo.mobile == '') {
      delete regInfo.mobile;
    }
    if (regInfo.email == '') {
      delete regInfo.email;
    }
    if (regInfo.nick == '') {
      delete regInfo.nick;
    }
    if (!regInfo.mobile && !regInfo.nick && !regInfo.email) {
      throw errors.WHAT_REQUIRE('手机，email或昵称');
    }

    if (regInfo.mobile) {
      if (!tools.validateTools.isChinaMobile(regInfo.mobile)) {
        throw errors.CHINA_MOBILE_ILLEGAL;
      }
    }
    if (regInfo.email) {
      if (!tools.validateTools.isEmail(regInfo.email)) {
        throw errors.EMAIL_ILLEGAL;
      }
    }
    if (regInfo.nick) {
      if (regInfo.nick.length < 3 || regInfo.length > 30) {
        throw errors.WHAT_WRONG_LENGTH_RANGE('昵称', 3, 30);
      }
    }
    regInfo.open_id = tools.stringTools.uuid(true);

    if (!regInfo.password) {
      regInfo.password = tools.stringTools.randomString(18);
    }

    var newPassword  = tools.stringTools.genPassword(regInfo.password);
    regInfo.password = newPassword.password;
    regInfo.salt     = newPassword.salt;

    var xid = yield db.insert('account', regInfo);

    delete regInfo.salt;
    delete regInfo.password;
    regInfo.id = xid.id;

    return regInfo;
  },
  getUserInfo           : function *(ticket) {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }
    var openId = myTools.getOpenId(ticket);

    return yield db.load("account", {
      where : "open_id=?",
      cols  : ["id", "nick", "email", "open_id", "mobile", "slogan", "avatar", "avatar_large"],
      params: [openId]
    });
  },
  loadByPassport        : function *(passport) {
    var where = 'nick=?';
    if (tools.validateTools.isEmail(passport)) {
      where = 'email=?';
    } else if (tools.validateTools.isChinaMobile(passport)) {
      where = 'mobile=?';
    }

    return yield  db.load("account", {
      where : where,
      params: [passport]
    });
  },
  loadById              : function *(id) {
    var where = 'id=?';

    return yield  db.load("account", {
      where : where,
      params: [id]
    });
  },
  loginByPassport       : function *(passport, password) {
    var mine = yield Account.loadByPassport(passport);
    if (!mine) {
      throw errors.LOGIN_ERROR_BECAUSE('用户没找到，请重新输入登录凭证。');
    }

    var cptPassword = tools.stringTools.computePassword(password, mine.salt);

    if (cptPassword !== mine.password) {
      throw errors.LOGIN_ERROR;
    }
    delete mine.password;
    delete mine.salt;
    return mine;

  },
  changePassword        : function *(open_id, password) {
    var salt        = tools.stringTools.randomString(12);
    var newPassword = tools.stringTools.computePassword(password, salt);
    var model       = {password: newPassword, salt: salt};
    return yield db.updateBatch("account", model, {where: 'open_id=?', params: [open_id]})
  },
  sendDynamicPassword   : function *(passport) {
    var passportType = 0; //啥也不是
    if (tools.validateTools.isChinaMobile(passport)) {
      passportType = 1;
    } else if (tools.validateTools.isEmail(passport)) {
      passportType = 2;
    }
    var captcha = tools.stringTools.captach();

    //返回值需要客户端存储
    if (passportType) {
      //todo: 这里要把这个 captcha 直接传送给用户。
      console.log("用户的动态验证码是：", passport, captcha);
      return myTools.makeTicketTemp(passport, captcha);
    }

    throw errors.PASSPORT_ILLEGAL;
  },
  loginByDynamicPassword: function *(passport, password, ticket) {
    if (!myTools.validateTicketTemp(passport, password, ticket)) {
      throw errors.CAPTCHA_VALIDATE_FAIL;
    }
    var mine = yield Account.loadByPassport(passport);
    delete mine.password;
    delete mine.salt;
    return mine;

  },
  loginFrom3rd          : function *(provider, map_id, nick) {
    //console.log("vvvvv");
    var myMap = yield db.load('account_map', {
      where : 'provider=? and map_id=?',
      params: [provider, map_id]
    });

    if (!myMap) {
      var model = {user_name: provider + "_" + map_id, nick: nick + "@" + provider};
      var res   = yield Account.register(model);

      var modelMap = {
        provider  : provider,
        map_id    : map_id,
        account_id: res.id,
        open_id   : res.open_id
      };
      yield db.insert('account_map', modelMap);
      return res;
    } else {
      var mine = yield Account.loadById(myMap.account_id);
      delete mine.password;
      delete mine.salt;
      return mine;
    }
  },
  bindFrom3rd           : function *(ticket, provider, map_id) {
    //todo: 绑定已经有的帐号。
    //throw errors.('尚未实现');
    throw errors.CUSTOM('尚未实现');
  },
  getRightsByService    : function *(ticket, service) {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }
    if (!service) {
      throw errors.WHAT_REQUIRE("微服务名称");
    }
    var openId = myTools.getOpenId(ticket);

    var userInfo = yield db.load("account", {
      where : "open_id=?",
      cols  : ["id", "nick", "email", "mobile", "account_type"],
      params: [openId]
    });

    var xservice = yield db.load("service", {
      where : "code=?",
      params: [service],
      cols  : ["id", "title", "code"]
    });
    if (xservice) {
      userInfo.rights = yield db.list("v_account_right", {
        where : "account_id=? and service_id=?",
        params: [userInfo.id, xservice.id],
        cols  : ["id", "title", "code"]
      });
    } else {
      userInfo.rights = [];
    }

    var uAType = 0 || parseInt(userInfo.account_type);
    if ((uAType & 8) == 8) {
      userInfo.rights.push({
        "id"   : 0,
        "title": "上帝管理员",
        "code" : "GOD_ADMIN"
      });
    }
    return userInfo;

  },

  checkGodAdmin: function *(ticket) {
    var rights     = yield Account.getRightsByService(ticket, "cloudarling");
    var adminRight = rights.rights.filter(function (ele) {
      return ele.id == 0;
    });
    if (!adminRight || adminRight.length == 0) {
      throw errors.NO_RIGHTS; // errors.CUSTOM("必须上帝管理员才有此权限。");
    }
  },

  listAll : function *(keyword, skip, limit) {
    skip       = skip || 0;
    limit      = limit || 20;
    var where  = "1=1";
    var params = [];
    if (keyword) {
      where += " and mobile like ? or email like ? or nick like ?";
      params.push("%" + keyword + "%", "%" + keyword + "%", "%" + keyword + "%");
    }
    return yield db.list("account", {
      cols   : ["id", "nick", "email", "open_id", "mobile", "slogan", "avatar", "avatar_large", "account_type"],
      where  : where,
      params : params,
      skip   : skip,
      limit  : limit,
      orderBy: "id desc"
    });
  },
  grantGod: function *(accountId, action) {
    var xuser = yield db.load('account', {
      where : "id=?",
      params: [accountId]
    });
    if (!xuser) {
      throw errors.WHAT_NOT_FOUND('用户');
    }
    var updateData = {
      id: accountId
    };
    if (action == 'add') {
      updateData.account_type = xuser.account_type | 8;
    } else {
      updateData.account_type = xuser.account_type & ~8;
    }
    return yield db.update('account', updateData);
  }

};


module.exports = Account;