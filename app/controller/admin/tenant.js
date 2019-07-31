const service = require('../../services/tenant');
const accountService = require('../../services/account');
const tools = require("../../tools");

module.exports = {
    $: async ctx => {
        const form = ctx.request.body;
        if (form.id) {
            form.updater = ctx.user.id;
        } else {
            form.creator = ctx.user.id;
        }
        const rtn = await service.save(form);
        return rtn;
    },
    _: async ctx => {
        const rtn = await service.deleteById(ctx.request.body.id);
        ctx.echo(rtn);
    },
    list: async ctx => {
        const rtn = await service.list(ctx.qs);
        ctx.echo(rtn);
    },
    $addAccount: async ctx => {
        const rtn = await service.addAccount(ctx.request.body);
        ctx.echo(rtn);
    },
    $removeAccount: async ctx => {
        const rtn = await service.removeAccount(ctx.request.body);
        ctx.echo(rtn);
    },
    listAccount: async ctx => {
        const rtn = await service.listAccounts(ctx.qs);
        ctx.echo(rtn);
    },
    $thirdPart: async ctx => {
        const tAccount = await service.thirdPartSave(ctx.request.body);
        const expires = new Date() / 1000 + 30 * 24 * 3600; //30 天过期
        const ticket = tools.makeTicket(tAccount.open_id, parseInt(expires), ctx.app.config)
        ticket.tenants = await accountService.listMyTenants(tAccount.id);
        ctx.echo(ticket);
    }
};