var tools          = require('../tools');
var errors         = require('cloudoll').errors;
var accountService = require('../services/Account');
var myTools        = require('../tools');

var Account = {
  register               : function *() {
    var form = this.request.body;
    //var expires_in = form.expires_in;

    var regInfo      = {};
    regInfo.mobile   = form.mobile;
    regInfo.email    = form.email;
    regInfo.password = form.password;
    regInfo.nick     = form.nick;
    regInfo.last_ip  = this.ip;
    var accRes       = yield accountService.register(regInfo);

    var openId = accRes.open_id;
    var tick   = tools.makeTicket(openId);
    tick.nick  = accRes.nick;
    this.body  = {errno: 0, data: tick};

  },
  info                   : function *() {
    var qs      = this.qs;
    var res = yield accountService.getUserInfo(qs.ticket);

    this.body = {errno: 0, data: res};
  },
  login                  : function *() {
    var form     = this.request.body;
    var passport = form.passport;
    var password = form.password;

    var mine = yield accountService.loginByPassport(passport, password);

    var openId   = mine.open_id;
    var tick     = tools.makeTicket(openId);
    tick.nick    = mine.nick;
    tick.open_id = openId;
    this.body    = {errno: 0, data: tick};
  },
  changePassword         : function *() {

    var form     = this.request.body;
    var password = form.password;
    var ticket   = form.ticket;

    if (!ticket) {
      throw errors.WHAT_REQUIRE("ticket");
    }
    var openId = myTools.getOpenId(ticket);
    yield accountService.changePassword(openId, password);
    this.body = {errno: 0};
  },
  sendDynamicPassword    : function *() {
    var form     = this.request.body;
    var passport = form.passport;
    var res      = yield accountService.sendDynamicPassword(passport);
    this.body    = {errno: 0, data: res};
  },
  loginByDynamicPassword : function *() {
    var form = this.request.body;

    var passport = form.passport;
    var password = form.password;
    var ticket   = form.ticket;

    var mine   = yield accountService.loginByDynamicPassword(passport, password, ticket);
    var openId = mine.open_id;
    var tick   = tools.makeTicket(openId);
    tick.nick  = mine.nick;
    this.body  = {errno: 0, data: tick};
  },
  loginFrom3rd           : function *() {
    var form = this.request.body;

    var provider = form.provider;
    var map_id   = form.map_id;
    var nick     = form.nick;

    var mine   = yield accountService.loginFrom3rd(provider, map_id, nick);
    var openId = mine.open_id;
    var tick   = tools.makeTicket(openId);
    tick.nick  = mine.nick;
    this.body  = {errno: 0, data: tick};
  },
  bindFrom3rd            : function *() {
    var form = this.request.body;

    var provider = form.provider;
    var map_id   = form.map_id;
    var nick     = form.nick;

    var mine = yield accountService.bindFrom3rd(provider, map_id, nick);
    // var openId = mine.open_id;
    // var tick   = tools.makeTicket(openId);
    // tick.nick  = mine.nick;
    // this.body  = {errno: 0, data: tick};
  },
  checkPassportToRegister: function *() {
    var form     = this.request.body;
    var passport = form.passport;
    var mine     = yield accountService.loadByPassport(passport);
    if (mine) {
      throw errors.WHAT_EXISTED('该帐号已经被注册。');
    }
    this.body = {errno: 0};
  },
  getRights              : function*() {
    var qs      = this.qs;
    var ticket  = qs.ticket;
    var service = qs.service;
    this.body   = {errno: 0, data: yield accountService.getRightsByService(ticket, service)};
  },
  listAll                : function *() {
    var qs      = this.qs;
    var ticket  = qs.ticket;
    var keyword = qs.keyword;
    var skip    = qs.skip || 0;
    var limit   = qs.limit || 20;
    yield accountService.checkGodAdmin(ticket);
    var res   = yield accountService.listAll(keyword, skip, limit);
    this.body = {errno: 0, data: res};
  },
  grantGod               : function *() {
    var form     = this.request.body;
    var acountId = form.account_id;
    var action   = form.action;

    var upRes = yield accountService.grantGod(acountId, action);
    console.log(upRes);
    this.body = {errno: 0};
  }
};

module.exports = Account;