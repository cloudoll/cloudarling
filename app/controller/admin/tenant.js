const service = require('../../services/tenant');

module.exports = {
    $: async ctx => {
        const form = ctx.request.body;
        if (form.id) {
            form.updater = ctx.user.id;
        } else {
            form.creator = ctx.user.id;
        }
        // console.log(form, 11111);
        const rtn = await service.save(form);
        return rtn;
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
    }
};