var errors = require("cloudoll").errors;
var tools = require("../../tools");
var accountService = require('../../services2/account');
// var stringTools    = require("common-tools").stringTools;
// var validateTools  = require("common-tools").validateTools;

/*
 * 无状态的登录管理
 *
 */
var AccountStateless = {
  hello: ctx => {
    ctx.body = "hello world";
  },
  h1: ctx => {
    ctx.echo("a");
  },

  $checkPassport: async ctx => {
    var form = ctx.request.body;
    var passport = form.passport;
    ctx.body = errors.success(await accountService.checkPassportAvailable(passport));
  },
  $login: async ctx => {
    var form = ctx.request.body;
    var passport = form.passport;
    var password = form.password;
    var expires_in = form.expires_in;

    var mine = await accountService.loginByPassport(passport, password);

    var openId = mine.open_id;
    var tick = tools.makeTicket(openId, expires_in, ctx.app.config);
    tick.nick = mine.nick;
    tick.open_id = openId;
    ctx.body = errors.success(tick);
  },
  $register: async ctx => {
    var form = ctx.request.body;
    var mine = await accountService.register(form);
    var openId = mine.open_id;

    var tick = tools.makeTicket(openId, null, ctx.app.config);
    tick.nick = mine.nick;
    tick.open_id = openId;
    ctx.echo(tick);
  },
  refreshTicket: async  ctx => {
    var qs = ctx.qs;
    var ticket = qs.ticket;

    var openId = tools.getOpenId(ticket);
    var tick = tools.makeTicket(openId);

    tools.responseJson(ctx, errors.success(rtn), qs);

  },
  info: async (ctx) => {
    var qs = ctx.qs;
    var ticket = qs.ticket;

    var rtn = await accountService.getInfoByTicket(ticket);

    tools.responseJson(ctx, errors.success(rtn), qs);
  },
  devices: async (ctx) => {
    var qs = ctx.qs;
    var ticket = qs.ticket;

    var rtn = await accountService.getDevicesByTicket(ticket);

    tools.responseJson(ctx, errors.success(rtn), qs);

  },
  rights: async (ctx, next) => {
    var qs = ctx.qs;
    var ticket = qs.ticket;
    var service = qs.service;
    var rtn = await accountService.getRightsByTicket(ticket, service);

    tools.responseJson(ctx, errors.success(rtn), qs);

  }
};


module.exports = AccountStateless;
