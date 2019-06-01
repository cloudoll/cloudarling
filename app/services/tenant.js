const doll = require("cloudoll");
const mysql = doll.orm.mysql;

const table = "tenant";
const me = module.exports = {
    list: async options => {
        const limit = parseInt(options.limit) || 20;
        const offset = parseInt(options.offset) || 0;

        const conditions = {
            limit: limit,
            skip: offset,
            cols: "id, title, title2,  title_short, fake_name, domain, grade, open_id",
            orderBy: "id desc"
        }
        const params = [];
        let where = "1=1 "
        if (options.id) {
            where += "and id=?";
            params.push(~~options.id);
        }
        if (options.q) {
            where += "and (title like ? or title_short like ? or fake_name like ? or domain like ?)";
            params.push(`%${options.q}%`, `%${options.q}%`, `%${options.q}%`, `%${options.q}%`);
        }
        conditions.where = where;
        conditions.params = params;
        const items = await mysql.list(table, conditions);
        const total = await mysql.count(table, conditions);
        return { items, total, limit, offset };
    },
    save: async options => {
        options.domain = options.domain && options.domain.trim();
        if (options.id) {
            if (options.domain) {
                const tOri = await mysql.loadById(table, options.id);
                if (tOri.domain != options.domain) {
                    if (await mysql.exists(table, {
                        where: "domain=?",
                        params: [options.domain]
                    })) {
                        throw doll.errors.WHAT_EXISTED("domain: " + options.domain);
                    }
                }
            }
            options.update_date = new Date();
            return await mysql.update(table, options);
        } else {
            if (!options.title) {
                throw doll.errors.WHAT_REQUIRE("title");
            }
            if (options.domain) {
                if (await mysql.exists(table, {
                    where: "domain=?",
                    params: [options.domain]
                })) {
                    throw doll.errors.WHAT_EXISTED("domain: " + options.domain);
                }
            }

            return await mysql.insert(table, options);
        }
    },
    addAccount: async options => {
        if (!options.open_id) {
            throw doll.errors.WHAT_REQUIRE("open_id");
        }
        if (!options.tenant_open_id) {
            throw doll.errors.WHAT_REQUIRE("tenant_open_id");
        }

        const cAccount = await mysql.load("account", {
            where: "open_id=?",
            params: [options.open_id]
        });
        if (!cAccount) {
            throw doll.errors.WHAT_NOT_EXISTS("当前用户");
        }

        const cTenant = await mysql.load("tenant", {
            where: "open_id=?",
            params: [options.tenant_open_id]
        });
        if (!cTenant) {
            throw doll.errors.WHAT_NOT_EXISTS("当前租户");
        }


        const tAccount = {
            account_id: cAccount.id,
            tenant_id: cTenant.id,
            permission: options.permission
        };

        const exists = await mysql.exists("tenant_account", {
            where: "account_id=? and tenant_id=?",
            params: [cAccount.id, cTenant.id]
        });

        if (!exists) {
            await mysql.insert("tenant_account", tAccount);
            // options.id = res.id;
            return true;
        } else {
            return false;
        }
    },
    removeAccount: async options => {
        if (!options.open_id) {
            throw doll.errors.WHAT_REQUIRE("open_id");
        }
        if (!options.tenant_open_id) {
            throw doll.errors.WHAT_REQUIRE("tenant_open_id");
        }

        const cAccount = await mysql.load("account", {
            where: "open_id=?",
            params: [options.open_id]
        });
        if (!cAccount) {
            throw doll.errors.WHAT_NOT_EXISTS("当前用户");
        }

        const cTenant = await mysql.load("tenant", {
            where: "open_id=?",
            params: [options.tenant_open_id]
        });
        if (!cTenant) {
            throw doll.errors.WHAT_NOT_EXISTS("当前租户");
        }

        const res = await mysql.delete("tenant_account", {
            where: "account_id=? and tenant_id=?",
            params: [cAccount.id, cTenant.id]
        });
        return res;
    },
    listAccounts: async options => {
        if (!options.tenant_open_id) {
            throw doll.errors.WHAT_REQUIRE("tenant_open_id");
        }
        const qkey = options.q;

        const cTenant = await mysql.load("tenant", {
            where: "open_id=?",
            params: [options.tenant_open_id]
        });
        if (!cTenant) {
            throw doll.errors.WHAT_NOT_EXISTS("当前租户");
        }


        const limit = parseInt(options.limit) || 20;
        const offset = parseInt(options.offset) || 0;

        const conditions = {
            limit: limit,
            skip: offset,
            cols: "id, tenant_id, open_id, permission",
            orderBy: "id desc"
        }
        const params = [cTenant.id];
        let where = "tenant_id=? ";
        if (qkey) {
            where += " and ((mobile like ?) or (email like ?) or (nick like ?))";
            params.push('%' + qkey + '%');
            params.push('%' + qkey + '%');
            params.push('%' + qkey + '%');
        }
        conditions.where = where;
        conditions.params = params;

        conditions.cols = "mobile, email, nick, avatar, avatar_large, slogan, permission";

        const items = await mysql.list("v_tenant_account", conditions);
        const total = await mysql.count("v_tenant_account", conditions);
        return ({ items, total, limit, offset });
    }

}