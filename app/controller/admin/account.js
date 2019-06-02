const accountService = require('../../services/account');
const tools = require("../../tools");

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
  $listMore: async ctx => {
    const form = ctx.request.body;
    ctx.echo(await accountService.getInfoByTickets(form.open_ids));
  },
  $thirdPart: async ctx => {
    const form = ctx.request.body;
    const tAccount = await accountService.thirdPartMap(form);
    const expires = new Date() / 1000 + 30 * 24 * 3600; //30 天过期
    const ticket = tools.makeTicket(tAccount.open_id, parseInt(expires), ctx.app.config)
    ctx.echo(ticket);
  },
  $thirdPartCanel: async ctx => {
    const form = ctx.request.body;
    ctx.echo(await accountService.thirdPartCancel(form));
  },
  $thirdPartLogin: async ctx => {
    const form = ctx.request.body;
    const mapUser = (await accountService.thirdPartLogin(form));
    const expires = new Date() / 1000 + 30 * 24 * 3600; //30 天过期
    const ticket = tools.makeTicket(mapUser.open_id, parseInt(expires), ctx.app.config)
    ctx.echo(ticket);
  },
};