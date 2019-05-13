const accountService = require('../../services/account');

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
    ctx.echo(await accountService.getInfoByTickets(form.open_ids))
  }
};