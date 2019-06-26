const accountService = require('../../services/account');
const tools = require("../../tools");
var errors = require('cloudoll').errors;

module.exports = {
  list: async ctx => {
    const rtn = await accountService.adminList(ctx.qs);
    ctx.echo(rtn);
  },
  $grantGod: async ctx => {
    ctx.echo(await accountService.grantGod(ctx.request.body.id));
  },
  $save: async ctx => {
    ctx.echo(await accountService.update(ctx.request.body));
  },
  info: async ctx => {
    let open_id = ctx.qs.open_id
    if (!open_id) {
      throw errors.CUSTOM("缺少open_id");
    }
    let data = await accountService.loadByOpenId(open_id)
    ctx.echo(data)
  },
  $listMore: async ctx => {
    const form = ctx.request.body;
    ctx.echo(await accountService.getInfoByTickets(form.open_ids));
  },
  $thirdPart: async ctx => {
    const form = ctx.request.body;
    const tAccount = await accountService.thirdPartMap(form);
    const expires = new Date() / 1000 + 30 * 24 * 3600; //30 天过期
    const ticket = tools.makeTicket(tAccount.open_id, parseInt(expires), ctx.app.config)
    ticket.tenants = await accountService.listMyTenants(tAccount.account_id);
    ctx.echo(ticket);
  },
  $thirdPartCancel: async ctx => {
    const form = ctx.request.body;
    ctx.echo(await accountService.thirdPartCancel(form));
  },
  $thirdPartLogin: async ctx => {
    const form = ctx.request.body;
    const mapUser = (await accountService.thirdPartLogin(form));
    const expires = new Date() / 1000 + 30 * 24 * 3600; //30 天过期
    const ticket = tools.makeTicket(mapUser.open_id, parseInt(expires), ctx.app.config)
    ticket.tenants = await accountService.listMyTenants(mapUser.account_id);
    ctx.echo(ticket);
  },
  getTicket: async ctx => {
    const passport = ctx.qs.passport;
    const mapUser = await accountService.loadByPassport(passport);
    const expires = new Date() / 1000 + 30 * 24 * 3600; //30 天过期
    const ticket = tools.makeTicket(mapUser.open_id, parseInt(expires), ctx.app.config)
    ticket.tenants = await accountService.listMyTenants(mapUser.id);
    ctx.echo(ticket);
  }
};