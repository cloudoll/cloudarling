var errors       = require("cloudoll").errors;
var request      = require('request');
var db           = require("cloudoll").orm.postgres;
var rightService = require('../../yservice/YRight');
var config       = require("../../config");

module.exports = Right = {

  $editService  : function*() {

    var form   = this.request.body;
    var ticket = form.ticket;
    delete form.ticket;

    var fID = parseInt(form.id);
    if (!fID) delete form.id;


    var res = yield db.save("service", form);

    if (res.id > 0)
      this.body = {errno: 0, data: res};
    else
      this.body = {errno: -1, errText: '虽然没出错，但也没有记录被更新'};

  },
  $delService   : function *() {

    var form   = this.request.body;
    var ticket = form.ticket;
    delete form.ticket;


    var fID = parseInt(form.id);
    if (!fID || fID <= 0) {
      throw errors.WHAT_WRONG_FORMAT("ID");
    }

    var xright = yield db.load("rights", {
      where : "service_id=$sid",
      params: {sid: fID}
    });
    if (xright) {
      throw errors.WHAT_OCCUPIED("该服务");
    }
    var res = yield db.delById("service", fID);

    this.body = {errno: 0, data: res};

  },
  listService   : function*() {

    var qs     = this.qs;
    var ticket = qs.ticket;

    var page = qs.page || 1;
    var size = qs.size || 20;

    var where = "1=1", queryParams = {};

    var tt = qs.title;

    if (tt) {
      where += " and title like $title";
      queryParams.mobile = '%' + tt + '%';
    }


    this.body = {
      errno: 0, data: yield db.list("service", {
        where  : where,
        params : queryParams,
        orderBy: "id desc",
        page   : page,
        size   : size,
        cols   : ['id', 'title', 'code', 'create_date']
      })
    };
  },
  $editRights   : function *() {
    var form   = this.request.body;
    var ticket = form.ticket;
    delete form.ticket;

    var fID = parseInt(form.id);
    if (!fID) delete form.id;


    var res = yield db.save("rights", form);

    if (res.id > 1)
      this.body = {errno: 0, data: res};
    else
      this.body = {errno: -1, errText: '虽然没出错，但也没有记录被更新'};

  },
  $listRights   : function*() {
    var qs     = this.qs;
    var ticket = qs.ticket;
    var page   = qs.page || 1;
    var size   = qs.size || 20;

    var where = "1=1", queryParams = {};

    var tt         = qs.title;
    var service_id = qs.service_id;

    if (tt) {
      where += " and title like $title";
      queryParams.mobile = '%' + tt + '%';
    }
    if (service_id) {
      where += " and service_id=$service_id";
      queryParams.service_id = service_id;

    }


    this.body = {
      errno: 0, data: yield db.list("rights", {
        where  : where,
        params : queryParams,
        orderBy: "id desc",
        page   : page,
        size   : size,
        cols   : ['id', 'title', 'code', 'create_date', 'service_id']
      })
    };

  },
  $delRights    : function *() {

    var form   = this.request.body;
    var ticket = form.ticket;
    delete form.ticket;

    var fID = parseInt(form.id);
    if (!fID || fID <= 0) {
      throw errors.WHAT_WRONG_FORMAT("ID");
    }

    var xright = yield db.load("user_rights", {
      where : "rights_id=$rights_id",
      params: {rights_id: fID}
    });
    if (xright) {
      throw errors.WHAT_OCCUPIED("该权限");
    }
    var res = yield db.delById("rights", fID);

    this.body = {errno: 0, data: res};

  },
  $grant        : function*() {

    var form   = this.request.body;
    var ticket = form.ticket;
    delete form.ticket;

    var account_id = form.account_id;
    var rights_id  = form.rights_id;

    var xright = yield db.load("user_rights", {
      where : "account_id=$account_id and rights_id=$rights_id",
      params: {account_id: account_id, rights_id: rights_id}
    });

    if (!xright) {
      yield db.insert("user_rights", {account_id: account_id, rights_id: rights_id});
      this.body = {errno: 0};
    }
    //else {
    //    this.body = {errno: -1, errText: '这个用户已经有这个权限了哦。'};
    //}
    this.body = {errno: 0};

    //var res = yield db.save("servive", form);
    //
    //if (res.effected == 1)
    //    this.body = {errno: 0};
    //else
    //    this.body = {errno: -1, errText: '虽然没出错，但也没有记录被更新'};

  },
  $ungrant      : function*() {

    var form   = this.request.body;
    var ticket = form.ticket;
    delete form.ticket;


    var account_id = form.account_id;
    var rights_id  = form.rights_id;

    yield db.del("user_rights", {
      where : "account_id=$account_id and rights_id=$rights_id",
      params: {account_id: account_id, rights_id: rights_id}

    });
    this.body = {errno: 0};

  },
  userRights: function*() {
    var qs     = this.qs;
    var ticket = qs.ticket;


    var page = qs.page || 1;
    var size = qs.size || 20;

    var account_id = qs.account_id;
    if (!account_id) {
      throw errors.WHAT_REQUIRE('account_id');
    }
    var where       = "account_id=$aid", queryParams = {};
    queryParams.aid = account_id;

    var service_id = qs.service_id;

    if (service_id) {
      where += " and service_id=$service_id";
      queryParams.service_id = service_id;

    }

    this.body = {
      errno: 0, data: yield db.list("v_user_rights", {
        where  : where,
        params : queryParams,
        orderBy: "id desc",
        page   : page,
        size   : size
      })
    };

  },

  syncFromCloudeer: function *() {
    var requestGetCo = function (url) {
      return function (callback) {
        request({url: url}, function (err, response, body) {
          callback(err, body);
        });
      }
    };

    var body     = yield requestGetCo(config.cloudeer.serviceHost + '/methods');
    var jMethods = JSON.parse(body);
    if (jMethods.errno == 0) {
      var xmethods = jMethods.data;
      for (var mt of xmethods) {
        var xservice = yield rightService.saveServiceAuto(mt.service);
        for (var mtd of mt.methods) {
          if (!mtd.open) {
            yield rightService.saveAuto(xservice.id, mtd.url, mtd.name);
          }
        }
      }
    } else {
      throw errors.CUSTOM(jMethods.errText);
    }
    this.body = {errno: 0};
  }

};