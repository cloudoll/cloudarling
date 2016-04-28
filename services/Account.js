var db      = require('ezway2mysql');
var tools   = require('common-tools');
var myTools = require('../tools');
var errors  = require('common-rest-errors');
var config  = require('../config');

var Account = {
  register              : function *(regInfo) {
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

    var cptPassword = tools.stringTools.computePassword(password, mine.salt);

    if (cptPassword !== mine.password) {
      throw errors.LOGIN_ERROR_COMMON;
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
  bindFrom3rd           : function (ticket, provider, map_id) {
    //todo: 绑定已经有的帐号。
  }

};


module.exports = Account;