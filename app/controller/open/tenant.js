const doll = require("cloudoll");
const accountService = require('../../services/account');
const mysql = doll.orm.mysql;
const errors = doll.errors;

module.exports = {
    $login: async ctx => {
        const form = ctx.request.body;
        // console.log(form, 12314);
        const passport = form.passport;
        const password = form.password;
        const expires_in = form.expires_in;

        const mine = await accountService.loginByPassport(passport, password);
        

        const conditions = {
            limit: 20,
            cols: "tenant_id, open_id, title, title_short，fake_name, domain",
            where: "open_id=?",
            params: [mine.open_id]
        }
        const tenants = await mysql.list("v_tenant_account", conditions);
        if (tenants && tenants.length > 0) {
            loginUser.tenants = tenants; //.map(ele => ele.tenant_id);
        }

        ctx.echo(loginUser);
    }
}