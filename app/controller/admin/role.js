var errors = require("cloudoll").errors;
var db = require("cloudoll").orm.postgres;

module.exports = {
  list: async ctx => {
    var qs = ctx.qs;

    var skip = qs.skip || 0;
    var limit = qs.limit || 100;

    var where = "1=1", queryParams = [];

    var qkey = qs.q;
    if (qkey) {
      where += " and ((title like ?)";
      queryParams.push('%' + qkey + '%');
    }


    ctx.echo(await db.list("role", {
      where: where,
      params: queryParams,
      orderBy: "id desc",
      skip: skip,
      limit: limit
    })
    );
  },

  $save:  async ctx => {
    var form = ctx.request.body;
    if (!form.title) {
      throw errors.WHAT_REQUIRE("角色名称");
    }
    ctx.echo(await db.save("role", form));
  },
  $editUser:  async ctx => {
    var form = ctx.request.body;
    if (!form.account_id) {
      throw errors.WHAT_REQUIRE("帐号");
    }
    if (!form.role_id) {
      throw errors.WHAT_REQUIRE("角色");
    }

    var userRole = await db.load("user_role", {
      where: "role_id=? and account_id=?",
      params: [ form.role_id,  form.account_id ]
    });

    if (userRole) {
      //delete
      await db.delById("user_role", userRole.id);
    } else {
      await db.save("user_role", form);
    }
    ctx.echo(true);
  },
  $editRights: async ctx => {
    var form = ctx.request.body;
    if (!form.rights_id) {
      throw errors.WHAT_REQUIRE("权限");
    }
    if (!form.role_id) {
      throw errors.WHAT_REQUIRE("角色");
    }

    var data = await db.load("role_rights", {
      where: "rights_id=? and role_id=?",
      params: [  form.rights_id,  form.role_id ]
    });

    if (data) {
      //delete
      await db.delById("role_rights", data.id);
    } else {
      await db.save("role_rights", form);
    }
    ctx.echo(true);
  }

};