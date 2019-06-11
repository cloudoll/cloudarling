const tools = require("../../tools");
const accountService = require('../../services/account');

/*
 * 无状态的登录管理
 *
 */
var AccountStateless = {
  init: async ctx => {
    const pwd = ctx.qs.password || tools.genRdmStr(8);
    const info = {
      email: "admin@arche.cloud",
      mobile: "13000000000",
      nick: "admin",
      password: pwd
    }
    const userInfo = await accountService.register(info);
    await accountService.grantGod(userInfo.id);
    info.tips = "请记住您的密码，使用 email，手机或者昵称，任意一个即可登录。";
    ctx.echo(info);
  },
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
    tick.accout_type = mine.account_type;
    tick.avatar = mine.avatar;
    tick.tenants = await accountService.listMyTenants(mine.id);
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
