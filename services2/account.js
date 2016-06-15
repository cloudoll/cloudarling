var db      = require('cloudoll').orm.postgres;
var tools   = require('common-tools');
var errors  = require('cloudoll').errors;
var myTools = require('../tools');


module.exports = {
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
    //regInfo.open_id = tools.stringTools.uuid(true);

    if (!regInfo.password) {
      regInfo.password = tools.stringTools.randomString(18);
    }

    var newPassword  = tools.stringTools.genPassword(regInfo.password);
    regInfo.password = newPassword.password;
    regInfo.salt     = newPassword.salt;

    var xid = yield db.insert('account', regInfo, ['id', 'open_id']);

    delete regInfo.salt;
    delete regInfo.password;
    regInfo.id = xid.id;

    return regInfo;
  },
  loadByPassport        : function *(passport) {
    var where = 'nick=$passport';
    if (tools.validateTools.isEmail(passport)) {
      where = 'email=$passport';
    } else if (tools.validateTools.isChinaMobile(passport)) {
      where = 'mobile=$passport';
    }

    return yield db.load("account", {
      where : where,
      params: {passport: passport}
    });
  },
  loadById              : function *(id) {
    var where = 'id=$id';
    return yield db.load("account", {
      where : where,
      params: {id: id}
    });
  },
  loginByPassport       : function *(passport, password) {
    if (!passport) {
      throw errors.WHAT_REQUIRE("帐号");
    }
    if (!password) {
      throw errors.WHAT_REQUIRE("密码");
    }
    var mine = yield this.loadByPassport(passport);
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
  checkPassportAvailable: function *(passport) {
    var mine = yield this.loadByPassport(passport);
    if (mine) {
      throw errors.WHAT_EXISTED(passport);
    }
    return true;
  },

  getAllByTicket    : function *(ticket) {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }
    var openId = myTools.getOpenId(ticket);

    var userInfo = yield db.load("account", {
      where : "open_id=$openId",
      cols  : ["id", "open_id", "youku_id", "nick", "email", "mobile", "slogan", "avatar", "avatar_large"],
      params: {openId: openId}
    });


    var userDevices  = yield db.take("device", {
      where : "account_id=$account_id",
      params: {account_id: userInfo.id},
      cols  : ["title", "sn", "mac", "code"]
    });
    userInfo.devices = userDevices.data;
    return userInfo;
  },
  getInfoByTicket   : function *(ticket) {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }
    var openId = myTools.getOpenId(ticket);

    return yield db.load("account", {
      where : "open_id=$openId",
      cols  : ["id", "open_id", "youku_id", "nick", "email", "mobile", "slogan", "avatar", "avatar_large"],
      params: {openId: openId}
    });


  },
  getRightsByTicket : function *(ticket, service_code) {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }
    if (!service_code) {
      throw errors.WHAT_REQUIRE("service");
    }
    var openId = myTools.getOpenId(ticket);

    var userInfo = yield db.load("account", {
      where : "open_id=$openId",
      cols  : ["id", "open_id", "youku_id", "nick", "email", "mobile", "account_type"],
      params: {openId: openId}
    });

    var xservice = yield db.load("service", {
      where : "code=$code",
      params: {code: service_code},
      cols  : ["id", "title", "code"]

    });
    if (xservice == null) {
      throw errors.WHAT_NOT_FOUND("服务 [" + service_code + "] ");
    }

    var userRights = yield db.take("v_user_rights", {
      where : "account_id=$account_id and service_id=$sid",
      params: {account_id: userInfo.id, sid: xservice.id},
      cols  : ["id", "title", "code"]
    });

    userInfo.rights = userRights.data;

    var uAType = 0 || parseInt(userInfo.account_type);
    if ((uAType & 8) == 8) {
      userInfo.rights.push({
        "id"   : "0",
        "title": "上帝管理员",
        "code" : "GOD_ADMIN"
      });
    }

    //if (userInfo)

    return userInfo;

  },
  getDevicesByTicket: function *(ticket) {
    if (!ticket)
      throw errors.WHAT_REQUIRE("ticket");
    var openId = myTools.getOpenId(ticket);

    var userInfo = yield db.load("account", {
      where : "open_id=$openId",
      cols  : ["id", "youku_id", "nick", "email", "mobile"],
      params: {openId: openId}
    });


    var userDevices = yield db.take("device", {
      where : "account_id=$aid",
      params: {aid: userInfo.id},
      cols  : ["title", "sn", "mac", "code"]
    });

    userInfo.devices = userDevices.data;

    return userInfo;

  },
  adminList           : function *(qs) {
    var page = qs.page || 1;
    var size = qs.size || 20;

    var where = "1=1", queryParams = {};

    var qmb = qs.mobile;
    var eml = qs.email;
    var nk  = qs.nick;

    if (qmb) {
      where += " and mobile like $mobile";
      queryParams.mobile = '%' + qmb + '%';
    }
    if (eml) {
      where += " and email like $email";
      queryParams.email = '%' + eml + '%';
    }
    if (nk) {
      where += " and nick like $nick";
      queryParams.nick = '%' + nk + '%';
    }

    return yield db.list("account", {
      where  : where,
      params : queryParams,
      orderBy: "id desc",
      page   : page,
      size   : size,
      cols   : ['id', 'mobile', 'email', 'nick', 'open_id', 'avatar']
    });

  }
};