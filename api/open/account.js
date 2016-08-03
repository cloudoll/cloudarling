// var request       = require("request");
var errors         = require("cloudoll").errors;
var stringTools    = require("common-tools").stringTools;
var validateTools  = require("common-tools").validateTools;
var tools          = require("../../tools");
var accountService = require('../../services2/account');

/*
 * 无状态的登录管理
 *
 */
var AccountStateless = {
  $checkPassport: function*() {
    var form     = this.request.body;
    var passport = form.passport;
    this.body    = errors.success(yield accountService.checkPassportAvailable(passport));
  },
  $login        : function *() {
    var form       = this.request.body;
    console.log(form);
    var passport   = form.passport;
    var password   = form.password;
    var expires_in = form.expires_in;

    var mine = yield accountService.loginByPassport(passport, password);

    var openId   = mine.open_id;
    var tick     = tools.makeTicket(openId, expires_in);
    tick.nick    = mine.nick;
    tick.open_id = openId;
    this.body    = errors.success(tick);
  },
  $register     : function*(next) {
    var form     = this.request.body;
    var mine     = yield accountService.register(form);
    var openId   = mine.open_id;

    var tick     = tools.makeTicket(openId);
    tick.nick    = mine.nick;
    tick.open_id = openId;
    this.echo(tick);
  },
  refreshTicket : function *() {
    var qs     = this.qs;
    var ticket = qs.ticket;

    var openId = tools.getOpenId(ticket);
    var tick   = tools.makeTicket(openId);

    tools.responseJson(this, errors.success(rtn), qs);

  },
  info          : function*(next) {
    var qs     = this.qs;
    var ticket = qs.ticket;

    var rtn = yield accountService.getInfoByTicket(ticket);

    tools.responseJson(this, errors.success(rtn), qs);
  },
  devices       : function*(next) {
    var qs     = this.qs;
    var ticket = qs.ticket;

    var rtn = yield accountService.getDevicesByTicket(ticket);

    tools.responseJson(this, errors.success(rtn), qs);

  },
  rights        : function*(next) {
    var qs      = this.qs;
    var ticket  = qs.ticket;
    var service = qs.service;
    var rtn     = yield accountService.getRightsByTicket(ticket, service);

    tools.responseJson(this, errors.success(rtn), qs);

  }
};


module.exports = AccountStateless;
