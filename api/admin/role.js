var errors = require("cloudoll").errors;
var db     = require("cloudoll").orm.postgres;
var config = require("../../config");

module.exports = {
  list: function*() {
    var qs = this.qs;

    var skip  = qs.skip || 0;
    var limit = qs.limit || 100;

    var where = "1=1", queryParams = {};

    var qkey = qs.q;
    if (qkey) {
      where += " and ((title like $qkey)";
      queryParams.qkey = '%' + qkey + '%';
    }


    this.echo(yield db.list("role", {
        where  : where,
        params : queryParams,
        orderBy: "id desc",
        skip   : skip,
        limit  : limit
      })
    );
  },

  $save      : function *() {
    var form = this.request.body;
    if (!form.title) {
      throw errors.WHAT_REQUIRE("角色名称");
    }
    this.echo(yield db.save("role", form));
  },
  $editUser  : function *() {
    var form = this.request.body;
    if (!form.account_id) {
      throw errors.WHAT_REQUIRE("帐号");
    }
    if (!form.role_id) {
      throw errors.WHAT_REQUIRE("角色");
    }

    var userRole = yield db.load("user_role", {
      where : "role_id=$roleId and account_id=$accountId",
      params: {roleId: form.role_id, accountId: form.account_id}
    });

    if (userRole) {
      //delete
      yield db.delById("user_role", userRole.id);
    } else {
      yield db.save("user_role", form);
    }
    this.echo(true);
  },
  $editRights: function *() {
    var form = this.request.body;
    if (!form.rights_id) {
      throw errors.WHAT_REQUIRE("权限");
    }
    if (!form.role_id) {
      throw errors.WHAT_REQUIRE("角色");
    }

    var data = yield db.load("role_rights", {
      where : "rights_id=$rightsId and role_id=$roleId",
      params: {rightsId: form.rights_id, roleId: form.role_id}
    });

    if (data) {
      //delete
      yield db.delById("role_rights", data.id);
    } else {
      yield db.save("role_rights", form);
    }
    this.echo(true);
  }

};