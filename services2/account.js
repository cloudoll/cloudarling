const db = require('cloudoll').orm.postgres;
const tools = require('common-tools');
const errors = require('cloudoll').errors;
const myTools = require('../tools');


const me = module.exports = {
  register: async (regInfo0) => {
    var regInfo = {};
    regInfo.mobile = regInfo0.mobile;
    regInfo.email = regInfo0.email;
    regInfo.nick = regInfo0.nick;
    regInfo.password = regInfo0.password;

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

    if (regInfo.mobile && !tools.validateTools.isChinaMobile(regInfo.mobile)) {
      throw errors.CHINA_MOBILE_ILLEGAL;
    }
    if (regInfo.email && !tools.validateTools.isEmail(regInfo.email)) {
      throw errors.EMAIL_ILLEGAL;
    }
    if (regInfo.nick && (regInfo.nick.length < 3 || regInfo.length > 30)) {
      throw errors.WHAT_WRONG_LENGTH_RANGE('昵称', 3, 30);
    }
    if (regInfo.mobile) {
      var existMobile = await db.load("account", {
        where: 'mobile=$mobile',
        params: { mobile: regInfo.mobile }
      });
      if (existMobile) {
        throw errors.WHAT_EXISTED("手机");
      }
    }
    if (regInfo.email) {
      var existEmail = await db.load("account", {
        where: 'email=$email',
        params: { email: regInfo.email }
      });
      if (existNick) {
        throw errors.WHAT_EXISTED("邮箱");
      }
    }
    if (regInfo.nick) {
      var existNick = await db.load("account", {
        where: 'nick=$nick',
        params: { nick: regInfo.nick }
      });
      if (existNick) {
        throw errors.WHAT_EXISTED("昵称");
      }

    }

    //regInfo.open_id = tools.stringTools.uuid(true);

    if (!regInfo.password) {
      regInfo.password = tools.stringTools.randomString(18);
    }

    var newPassword = tools.stringTools.genPassword(regInfo.password);
    regInfo.password = newPassword.password;
    regInfo.salt = newPassword.salt;

    var xid = await db.insert('account', regInfo, ['id', 'open_id']);

    delete regInfo.salt;
    delete regInfo.password;
    regInfo.id = xid.id;
    regInfo.open_id = xid.open_id;

    return regInfo;
  },
  loadByPassport: async (passport) => {
    var where = 'nick=$passport';
    if (tools.validateTools.isEmail(passport)) {
      where = 'email=$passport';
    } else if (tools.validateTools.isChinaMobile(passport)) {
      where = 'mobile=$passport';
    }

    return await db.load("account", {
      where: where,
      params: { passport: passport }
    });
  },
  loadById: async (id) => {
    var where = 'id=$id';
    return await db.load("account", {
      where: where,
      params: { id: id }
    });
  },
  loginByPassport: async (passport, password) => {
    if (!passport) {
      throw errors.WHAT_REQUIRE("帐号");
    }
    if (!password) {
      throw errors.WHAT_REQUIRE("密码");
    }
    var mine = await me.loadByPassport(passport);
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
  checkPassportAvailable: async (passport) => {
    var mine = await me.loadByPassport(passport);
    if (mine) {
      throw errors.WHAT_EXISTED(passport);
    }
    return true;
  },

  getAllByTicket: async (ticket) => {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }
    var openId = myTools.getOpenId(ticket);

    var userInfo = await db.load("account", {
      where: "open_id=$openId",
      cols: ["id", "open_id", "account_type", "nick", "email", "mobile", "slogan", "avatar", "avatar_large"],
      params: { openId: openId }
    });


    userInfo.devices = await db.take("device", {
      where: "account_id=$account_id",
      params: { account_id: userInfo.id },
      cols: ["title", "sn", "mac", "code"]
    });
    return userInfo;
  },
  getInfoByTicket: async (ticket) => {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }
    var openId = myTools.getOpenId(ticket);

    var data = await db.load("account", {
      where: "open_id=$openId",
      cols: ["id", "open_id", "account_type", "nick", "email", "mobile", "slogan", "avatar", "avatar_large"],
      params: { openId: openId }
    });
    if (!data) {
      throw errors.WHAT_NOT_EXISTS('用户');
    }
    return data;
  },
  getRightsByTicket: async (ticket, service_code) => {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }

    var openId = myTools.getOpenId(ticket);
    var userInfo = await db.load("account", {
      where: "open_id=$openId",
      cols: ["id", "open_id", "youku_id", "nick", "email", "mobile", "account_type"],
      params: { openId: openId }
    });


    var uAType = 0 || parseInt(userInfo.account_type);
    if ((uAType & 8) == 8) {
      userInfo.rights = [{
        "id": "0",
        "title": "上帝管理员",
        "code": "GOD_ADMIN"
      }];
      return userInfo;
    }


    if (!service_code) {
      throw errors.WHAT_REQUIRE("service");
    }

    var xservice = await db.load("service", {
      where: "code=$code",
      params: { code: service_code },
      cols: ["id", "title", "code"]

    });
    if (xservice == null) {
      throw errors.WHAT_NOT_FOUND("服务 [" + service_code + "] ");
    }


    userInfo.rights = await db.take("v_user_rights", {
      where: "account_id=$account_id and service_id=$sid",
      params: { account_id: userInfo.id, sid: xservice.id },
      cols: ["id", "title", "code"]
    });

    return userInfo;

  },

  getDevicesByTicket: async (ticket) => {
    if (!ticket)
      throw errors.WHAT_REQUIRE("ticket");
    var openId = myTools.getOpenId(ticket);

    var userInfo = await db.load("account", {
      where: "open_id=$openId",
      cols: ["id", "youku_id", "nick", "email", "mobile"],
      params: { openId: openId }
    });

    userInfo.devices = await db.take("device", {
      where: "account_id=$aid",
      params: { aid: userInfo.id },
      cols: ["title", "sn", "mac", "code"]
    });

    return userInfo;

  },
  adminList: async (qs) => {

    var skip = qs.skip || 0;
    var limit = qs.limit || 20;

    var where = "1=1", queryParams = {};

    var qkey = qs.q;
    //
    // var qmb = qs.mobile;
    // var eml = qs.email;
    // var nk  = qs.nick;

    if (qkey) {
      where += " and ((mobile like $qkey) or (email like $qkey) or (nick like $qkey))";
      queryParams.qkey = '%' + qkey + '%';
    }

    return await db.list("account", {
      where: where,
      params: queryParams,
      orderBy: "id desc",
      skip: skip,
      limit: limit,
      cols: ['id', 'mobile', 'email', 'nick', 'open_id', 'avatar', 'account_type']
    });
  },
  grantGod: async (accountId) => {
    if (!accountId) {
      throw errors.WHAT_REQUIRE('id');
    }
    accountId = parseInt(accountId);
    var me = await db.loadById("account", accountId, ['id', 'account_type']);
    var updateData = { id: accountId };

    if ((me.account_type & 8) == 8) {
      updateData.account_type = updateData.account_type & ~8;
    } else {
      updateData.account_type = updateData.account_type | 8;
    }
    await db.update('account', updateData);
    return true;

  },
  update: async (regInfo) => {
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

    if (regInfo.password && regInfo.password != "") {
      var newPassword = tools.stringTools.genPassword(regInfo.password);
      regInfo.password = newPassword.password;
      regInfo.salt = newPassword.salt;
    } else {
      delete regInfo.password;
    }

    delete regInfo.open_id;
    delete regInfo.account_type;
    delete regInfo.avatar;

    if (!regInfo.id) {
      delete regInfo.id;
    }


    var xid = await db.save('account', regInfo, ['id', 'open_id']);

    delete regInfo.salt;
    delete regInfo.password;
    regInfo.id = xid.id;

    return regInfo;


  }
};