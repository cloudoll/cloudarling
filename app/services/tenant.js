const doll = require("cloudoll");
const mysql = doll.orm.mysql;
const accountService = require("./account");

const table = "tenant";
const me = module.exports = {
    list: async options => {
        const limit = parseInt(options.limit) || 20;
        const offset = parseInt(options.offset) || 0;

        const conditions = {
            limit: limit,
            skip: offset,
            cols: "id, title, title2,  title_short, fake_name, domain, grade, open_id, address, area_id,tel1,tel2,logo",
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
    thirdPartSave: async options => {
        if (!options.title) {
            throw doll.errors.WHAT_REQUIRE("title");
        }
        let akont;
        if (options.mobile || options.email) {
            akont = await accountService.loadByPassport(options.mobile || options.email);
            if (!akont) {
                akont = await accountService.register({
                    mobile: options.mobile,
                    email: options.email,
                    password: options.password || "11111111"
                });
            }
        } else {
            throw doll.errors.WHAT_REQUIRE("mobile 或 email");
        }
        let tInfo = {
            title: options.title,
            domain: options.domain,
            fake_name: options.fake_name,
            open_id: options.tenant_open_id
        }
        let tnent;
        if (tInfo.open_id) {
            tnent = await mysql.load("tenant", {
                where: "open_id=?",
                params: [tInfo.open_id]
            });
        }
        if (!tnent) {
            tnent = await mysql.insert("tenant", tInfo);
        }

        let tMap = {
            account_id: akont.id,
            tenant_id: tnent.id,
            account_type: 9
        }
        const exists = await mysql.exists("tenant_account", {
            where: "account_id=? and tenant_id=?",
            params: [tMap.account_id, tMap.tenant_id]
        });
        if (!exists) {
            await mysql.insert("tenant_account", tMap);
        }
        return akont;
    },
    addAccount: async options => {
        //系统后台增加的用户一定是 租户管理员
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
            permission: options.permission,
            account_type: 9
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
    deleteById: async id => { //todo：只对于平台，商户要加判断
        if (!id) {
            throw doll.errors.WHAT_REQUIRE("id");
        }
        return await mysql.delete(table, {
            where: "id=?",
            params: [id]
        })
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

        conditions.cols = "mobile, email, nick, avatar, avatar_large, slogan, permission, open_id, title";

        const items = await mysql.list("v_tenant_account", conditions);
        const total = await mysql.count("v_tenant_account", conditions);
        return ({ items, total, limit, offset });
    },
    info: async qs => {
        let tenant_id = qs.tenant_id
        console.log('tenant_id', tenant_id)
        if (!tenant_id) {
            throw doll.errors.CUSTOM("缺少tenant_id");
        }
        let info = await mysql.load("tenant", {
            where: "open_id=?",
            params: [tenant_id]
        });
        return info;
    }

}