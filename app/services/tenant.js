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
            cols: "id, title, title_short, domain, grade, open_id",
            orderBy: "id desc"
        }
        const params = [];
        let where = "1=1 "
        if (options.id) {
            where += "and id=?";
            params.push(~~options.id);
        }
        if (options.q) {
            where += "and (title like ? or title_short like ?)";
            params.push(`%${options.q}%`, `%${options.q}%`);
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
        if (!options.tenant_id) {
            throw doll.errors.WHAT_REQUIRE("tenant_id");
        }
        const tAccount = {
            open_id: options.open_id,
            tenant_id: options.tenant_id,
            permission: options.permission
        };

        const exists = await mysql.exists("tenant_account", {
            where: "open_id=? and tenant_id=?",
            params: [options.open_id, options.tenant_id]
        });

        if (!exists) {
            const res = await mysql.insert("tenant_account", tAccount);
            options.id = res.id;
            return true;
        } else {
            return false;
        }
    },
    removeAccount: async options => {
        if (!options.open_id) {
            throw doll.errors.WHAT_REQUIRE("open_id");
        }
        if (!options.tenant_id) {
            throw doll.errors.WHAT_REQUIRE("tenant_id");
        }
        const res = await mysql.delete("tenant_account", {
            where: "open_id=? and tenant_id=?",
            params: [options.open_id, options.tenant_id]
        });
        return res;
    },
    listAccounts: async options => {
        if (!options.tenant_id) {
            throw doll.errors.WHAT_REQUIRE("tenant_id");
        }

        const limit = parseInt(options.limit) || 20;
        const offset = parseInt(options.offset) || 0;

        const conditions = {
            limit: limit,
            skip: offset,
            cols: "id, tenant_id, open_id, permission",
            orderBy: "id desc"
        }
        const params = [~~options.tenant_id];
        let where = "tenant_id=? "
        if (options.id) {
            where += "and id=?";
            params.push(~~options.id);
        }
        conditions.where = where;
        conditions.params = params;
        const items = await mysql.list("tenant_account", conditions);
        const total = await mysql.count("tenant_account", conditions);
        ctx.echo({ items, total, limit, offset });
    }

}