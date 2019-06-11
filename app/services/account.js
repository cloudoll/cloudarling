const db = require('cloudoll').orm.mysql;
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
    regInfo.open_id = regInfo0.open_id;

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
        where: 'mobile=?',
        params: [regInfo.mobile]
      });
      if (existMobile) {
        throw errors.WHAT_EXISTED("手机");
      }
    }

    if (regInfo.open_id) {
      var existMobile = await db.load("account", {
        where: 'open_id=?',
        params: [regInfo.open_id]
      });
      if (existMobile) {
        throw errors.WHAT_EXISTED("open_id");
      }
    }

    if (regInfo.email) {
      var existEmail = await db.load("account", {
        where: 'email=?',
        params: [regInfo.email]
      });
      if (existEmail) {
        throw errors.WHAT_EXISTED("邮箱");
      }
    }
    if (regInfo.nick) {
      var existNick = await db.load("account", {
        where: 'nick=?',
        params: [regInfo.nick]
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

    var xid = await db.insert('account', regInfo);

    return await db.load("account", {
      where: "id=?",
      params: [xid.id],
      cols: "id, open_id, mobile, email, nick"
    });
    // delete regInfo.salt;
    // delete regInfo.password;
    // regInfo.id = xid.id;
    // regInfo.open_id = xid.open_id;

    // return regInfo;
  },
  loadByPassport: async (passport) => {
    if (!passport) {
      throw errors.WHAT_REQUIRE("帐号");
    }
    let where = 'nick=?';
    if (tools.validateTools.isEmail(passport)) {
      where = 'email=?';
    } else if (tools.validateTools.isChinaMobile(passport)) {
      where = 'mobile=?';
    }
    return await db.load("account", {
      where: where,
      params: [passport]
    });
  },
  loadById: async (id) => {
    var where = 'id=?';
    return await db.load("account", {
      where: where,
      params: [id]
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
      where: "open_id=?",
      cols: ["id", "open_id", "account_type", "nick", "email", "mobile", "slogan", "avatar", "avatar_large"],
      params: [openId]
    });


    userInfo.devices = await db.take("device", {
      where: "account_id=?",
      params: [userInfo.id],
      cols: ["title", "sn", "mac", "code"]
    });
    return userInfo;
  },
  getInfoByTicket: async (ticket, pubKey) => {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }
    var openId = myTools.getOpenId(ticket, pubKey);

    var data = await db.load("account", {
      where: "open_id=?",
      cols: ["id", "open_id", "account_type", "nick", "email", "mobile", "slogan", "avatar", "avatar_large"],
      params: [openId]
    });
    if (!data) {
      throw errors.WHAT_NOT_EXISTS('用户');
    }
    return data;
  },
  getInfoByTickets: async (openIds) => {
    if (!openIds || openIds.length <= 0) {
      throw errors.WHAT_REQUIRE("openIds");
    }

    var data = await db.list("account", {
      where: "open_id in (?)",
      limit: 200,
      cols: ["id", "open_id", "account_type", "nick", "email", "mobile", "slogan", "avatar", "avatar_large"],
      params: [openIds]
    });
    return data;
  },
  getRightsByTicket: async (ticket, service_code, pubKey) => {
    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }

    var openId = myTools.getOpenId(ticket, pubKey);
    var userInfo = await db.load("account", {
      where: "open_id=?",
      cols: ["id", "open_id", "youku_id", "nick", "email", "mobile", "account_type"],
      params: [openId]
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
      where: "code=?",
      params: [service_code],
      cols: ["id", "title", "code"]

    });
    if (xservice == null) {
      throw errors.WHAT_NOT_FOUND("服务 [" + service_code + "] ");
    }


    userInfo.rights = await db.take("v_user_rights", {
      where: "account_id=? and service_id=?",
      params: [userInfo.id, xservice.id],
      cols: ["id", "title", "code"]
    });

    return userInfo;

  },

  getDevicesByTicket: async (ticket, pubKey) => {
    if (!ticket)
      throw errors.WHAT_REQUIRE("ticket");
    var openId = myTools.getOpenId(ticket, pubKey);

    var userInfo = await db.load("account", {
      where: "open_id=?",
      cols: ["id", "youku_id", "nick", "email", "mobile"],
      params: [openId]
    });

    userInfo.devices = await db.take("device", {
      where: "account_id=?",
      params: [userInfo.id],
      cols: ["title", "sn", "mac", "code"]
    });

    return userInfo;

  },
  adminList: async (qs) => {

    var limit = qs.limit || 20;
    var offset = qs.offset || 0;

    var where = "1=1", queryParams = [];

    var qkey = qs.q;

    if (qkey) {
      where += " and ((mobile like ?) or (email like ?) or (nick like ?))";
      queryParams.push('%' + qkey + '%');
      queryParams.push('%' + qkey + '%');
      queryParams.push('%' + qkey + '%');
    }
    const condition = {
      where: where,
      params: queryParams,
      orderBy: "id desc",
      skip: offset,
      limit: limit,
      cols: ['id', 'mobile', 'email', 'nick', 'open_id', 'avatar', 'account_type']
    };
    const items = await db.list("account", condition);
    const total = await db.count("account", condition);
    return { items, total, limit, offset };
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

    //TODO: 这里没有去重
    delete regInfo.open_id;
    // delete regInfo.account_type;
    // delete regInfo.avatar;
    await db.update('account', regInfo);
    // if (!regInfo.id) {
    //   delete regInfo.id;
    // }
    delete regInfo.salt;
    delete regInfo.password;
    return regInfo;
  },
  thirdPartMap: async options => {
    const mobile = options.mobile;
    const email = options.email;
    const map_id = options.map_id;
    const open_id = options.open_id;
    let password = options.password;
    const provider = options.provider;
    if (!mobile && !email) {
      throw errors.WHAT_REQUIRE('手机或者email');
    }
    if (mobile && email) {
      throw errors.CUSTOM('手机和email只能填写一个');
    }
    if (!map_id) {
      throw errors.WHAT_REQUIRE('第三方用户ID');
    }
    if (!provider) {
      throw errors.WHAT_REQUIRE('provider');
    }
    if (!password) {
      password = myTools.genRdmStr(8);
    }

    const tMapUser = await db.load("v_account_map", {
      where: "provider=? and map_id=?",
      params: [provider, map_id]
    });
    if (tMapUser) {
      throw errors.CUSTOM("您已经绑定过，请直接登录。");
    }


    let where = "";
    let params = [];
    if (mobile) {
      where = "mobile=?";
      params.push(mobile);
    } else if (email) {
      where = "email=?";
      params.push(email);
    }
    const cols = "id, open_id, mobile, email, nick"
    let tAccount = await db.load("account", {
      where, params, cols
    });

    if (!tAccount) {
      //没有找到用户，则注册一个
      tAccount = await me.register({ mobile, email, password, open_id });
    }
    const tMapUser2 = await db.load("v_account_map", {
      where: "provider=? and account_id=?",
      params: [provider, tAccount.id]
    });
    if (tMapUser2) {
      throw errors.CUSTOM("此手机/email已经被绑定，请更换其他手机/email。");
    }

    if (!tMapUser) {
      await db.insert("account_map", {
        account_id: tAccount.id,
        open_id: tAccount.open_id,
        provider: provider,
        map_id: map_id
      });
    }
    return tAccount;
  },
  thirdPartCancel: async options => {
    const map_id = options.map_id;
    const provider = options.provider;
    if (!map_id) {
      throw errors.WHAT_REQUIRE('第三方用户ID');
    }
    if (!provider) {
      throw errors.WHAT_REQUIRE('provider');
    }
    return await db.delete("account_map", {
      where: "provider=? and map_id=?",
      params: [provider, map_id]
    });
  },
  thirdPartLogin: async options => {
    const map_id = options.map_id;
    const provider = options.provider;
    if (!map_id) {
      throw errors.WHAT_REQUIRE('第三方用户ID');
    }
    if (!provider) {
      throw errors.WHAT_REQUIRE('provider');
    }
    const tMapUser = await db.load("v_account_map", {
      where: "provider=? and map_id=?",
      params: [provider, map_id]
    });
    if (!tMapUser) {
      throw errors.CUSTOM("当前用户未绑定，请绑定手机号或 email。");
    }
    return tMapUser;
  },
  listMyTenants: async accountId => {
    return await db.list("v_tenant_account", {
      where: "account_id=?",
      cols: "account_type, title, domain, tenant_open_id",
      limit: 100,
      params: [accountId]
    });
  }
};