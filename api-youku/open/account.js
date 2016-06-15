var request       = require("request");
// var NodeRSA = require('node-rsa');
var errors        = require("cloudoll").errors;
var stringTools   = require("common-tools").stringTools;
var validateTools = require("common-tools").validateTools;
var tools         = require("../../tools");
var yaccount      = require("../../yservice/YAccount");
var ycaptcha      = require("../../yservice/YCaptcha");

/*
 * 无状态的登录管理
 *
 */
var AccountStateless = {
  $login         : function *() {
    var form = this.request.body;

    var passport   = form.passport;
    var password   = form.password;
    var expires_in = form.expires_in;


    // var res = '{"errno":-3,"errText":"请填写正确的手机号或者Email"}';

    var res = null;
    if (validateTools.isEmail(passport) || validateTools.isChinaMobile(passport)) {
      res = yield tools.apiPost("/passport/login_by_passport", {
        passport: passport,
        password: stringTools.md5(password),
        ip      : this.ip,
        from    : "YoukuTV"
      });
    } else {
      res = yield tools.apiPost("/passport/login", {
        username: passport,
        password: stringTools.md5(password),
        ip      : this.ip,
        from    : "YoukuTV"
      });
    }
    var resJson = null;
    try {
      resJson = JSON.parse(res);
      // console.log(resJson);
    } catch (e) {
      // console.log(res);
      throw errors.LOGIN_ERROR_BECAUSE("远程服务器返回了非JSON数据，已经记录在log里");
    }
    if (!resJson) {
      throw errors.LOGIN_ERROR;
    }
    var ticket = yield yaccount.afterYoukuLogin(resJson, password, expires_in);
    this.body  = errors.success(ticket);// {errno: 0, data: ticket};

  },
  loginByCookie : function*(next) {
    var qs         = this.qs;
    var cookie     = qs.cookie;
    var expires_in = qs.expires_in;
    if (!cookie)
      throw errors.WHAT_REQUIRE("cookie");

    var res = yield tools.apiGet("/passport/auth", {
      cookie: cookie,
      ip    : this.ip,
      from  : "YoukuTV"
    });

    var resJson = JSON.parse(res);
    var ticket  = yield yaccount.afterYoukuLogin(resJson, null, expires_in);
    this.body   = errors.success(ticket);

  },
  $register      : function*(next) {
    var form = this.request.body;
    var passport   = form.passport;
    var password   = form.password;
    var captcha    = form.captcha;
    var expires_in = form.expires_in;

    if (!passport)
      throw errors.WHAT_REQUIRE("手机或者Email");
    if (!password)
      throw  errors.WHAT_REQUIRE("密码");

    if (!captcha)
      throw errors.WHAT_REQUIRE("验证码");

    var validresult = yield ycaptcha.validateCaptcha(passport, captcha);
    if (!validresult)
      throw errors.CAPTCHA_VALIDATE_FAIL;


    var data = {};
    if (validateTools.isChinaMobile(passport)) data.mobile = passport;
    else if (validateTools.isEmail(passport)) data.email = passport;
    data.password = stringTools.md5(password);
    if (form.nick) data.nickname = form.nick;
    data.from = "YoukuTV";
    data.ip   = this.ip;

    var res = yield tools.apiPost("/passport/register", data);


    var resJson = JSON.parse(res);
    if (resJson.errno == 0) {
      var userInfoJson = resJson.data;
      var youkuId      = userInfoJson.id;


      //--------- Update youkutv account info ------------
      var accountInfo = {
        youku_id: youkuId,
        nick    : userInfoJson.nickname,
        email   : userInfoJson.email,
        mobile  : userInfoJson.mobile,
        password: password
      };


      var accRes = yield yaccount.update(accountInfo);

      var openId = accRes.open_id;

      var tick  = tools.makeTicket(openId, expires_in);
      tick.nick = userInfoJson.nickname;

      this.body = errors.success(tick);
    } else {
      this.body = res;
    }
  },
  refreshTicket : function *() {
    var qs     = this.qs;
    var ticket = qs.ticket;

    var openId = tools.getOpenId(ticket);
    var tick   = tools.makeTicket(openId);

    tools.responseJson(this, errors.success(rtn), qs);

  },
  infoAll    : function*(next) {
    var qs     = this.qs;
    var ticket = qs.ticket;

    var rtn = yield yaccount.getAllByTicket(ticket);

    tools.responseJson(this, errors.success(rtn), qs);

  },
  info   : function*(next) {
    var qs     = this.qs;
    var ticket = qs.ticket;

    var rtn = yield yaccount.getInfoByTicket(ticket);

    tools.responseJson(this, errors.success(rtn), qs);
  },
  devices: function*(next) {
    var qs     = this.qs;
    var ticket = qs.ticket;

    var rtn = yield yaccount.getDevicesByTicket(ticket);

    tools.responseJson(this, errors.success(rtn), qs);

  },
  rights : function*(next) {
    var qs      = this.qs;
    var ticket  = qs.ticket;
    var service = qs.service;
    if (!service) {
      throw errors.WHAT_REQUIRE("service");
    }
    var rtn = yield yaccount.getRightsByTicket(ticket, service);

    tools.responseJson(this, errors.success(rtn), qs);

  }
};


module.exports = AccountStateless;
