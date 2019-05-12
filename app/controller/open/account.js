const tools = require("../../tools");
const accountService = require('../../services/account');

/*
 * 无状态的登录管理
 *
 */
var AccountStateless = {
  $checkPassport: async ctx => {
    const form = ctx.request.body;
    const passport = form.passport;
    ctx.echo(await accountService.checkPassportAvailable(passport));
  },
  $login: async ctx => {
    const form = ctx.request.body;
    const passport = form.passport;
    const password = form.password;
    const expires_in = form.expires_in;

    const mine = await accountService.loginByPassport(passport, password);

    const openId = mine.open_id;
    const tick = tools.makeTicket(openId, expires_in, ctx.app.config);
    tick.nick = mine.nick;
    tick.open_id = openId;
    ctx.echo(tick)
  },
  $register: async ctx => {
    const form = ctx.request.body;
    const mine = await accountService.register(form);
    const openId = mine.open_id;

    const tick = tools.makeTicket(openId, null, ctx.app.config);
    tick.nick = mine.nick;
    tick.open_id = openId;
    ctx.echo(tick);
  },
  refreshTicket: async ctx => {
    const qs = ctx.qs;
    const ticket = qs.ticket;

    // console.log(ticket);
    const openId = tools.getOpenId(ticket, ctx.app.config.account.public_key);
    const tick = tools.makeTicket(openId, null, ctx.app.config);
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
