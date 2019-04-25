const tools = require("../../tools");
const accountService = require('../../services/account');

/*
 * 无状态的登录管理
 *
 */
var AccountStateless = {
  hello: ctx => {
    ctx.body = "hello world";
  },
  h1: ctx => {
    ctx.echo("w l u");
  },

  $checkPassport: async ctx => {
    var form = ctx.request.body;
    var passport = form.passport;
    ctx.echo(await accountService.checkPassportAvailable(passport));
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
    ctx.echo(tick)
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
  refreshTicket: async ctx => {
    var qs = ctx.qs;
    var ticket = qs.ticket;

    console.log(ticket);
    var openId = tools.getOpenId(ticket, ctx.app.config.account.public_key);
    var tick = tools.makeTicket(openId, null, ctx.app.config);
    ctx.echo(tick);


  },
  info: async (ctx) => {
    var qs = ctx.qs;
    var ticket = qs.ticket;

    var rtn = await accountService.getInfoByTicket(ticket, ctx.app.config.account.public_key);

    ctx.echo(rtn);
  },
  devices: async (ctx) => {
    var qs = ctx.qs;
    var ticket = qs.ticket;
    var rtn = await accountService.getDevicesByTicket(ticket, ctx.app.config.account.public_key);
    ctx.echo(rtn);
  },
  rights: async (ctx) => {
    var qs = ctx.qs;
    var ticket = qs.ticket;
    var service = qs.service;
    var rtn = await accountService.getRightsByTicket(ticket, service, ctx.app.config.account.public_key);
    ctx.echo(rtn);

  }
};


module.exports = AccountStateless;
