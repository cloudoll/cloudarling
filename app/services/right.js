var db      = require('cloudoll').orm.mysql;
var tools   = require('common-tools');
var errors  = require('cloudoll').errors;
var myTools = require('../tools');


module.exports = {

  editService: function*(form) {
    var fID = parseInt(form.id);
    if (!fID) {
      delete form.id;
    }
    var res = yield db.save("service", form);

    if (res.id > 0) {
      return res;
    }
    throw errors.CUSTOM('虽然没出错，但也没有记录被更新。');
  },
  delService : function *(form) {
    var fID = parseInt(form.id);
    if (!fID || fID <= 0) {
      throw errors.WHAT_NOT_FOUND('服务 id');
    }

    var xright = yield db.load("rights", {
      where : "service_id=$sid",
      params: {sid: fID}
    });
    if (xright) {
      throw errors.WHAT_OCCUPIED("该服务");
    }
    return yield db.delById("service", fID);
  },
  listService: function*(qs) {

    var page = qs.page || 1;
    var size = qs.size || 20;

    var where = "1=1", queryParams = {};

    var tt = qs.title;

    if (tt) {
      where += " and title like $title";
      queryParams.mobile = '%' + tt + '%';
    }

    return yield db.list("service", {
      where  : where,
      params : queryParams,
      orderBy: "id desc",
      page   : page,
      size   : size,
      cols   : ['id', 'title', 'code', 'create_date']
    });
  },
  editRights : function *(form) {
    var fID = parseInt(form.id);
    if (!fID) delete form.id;

    var res = yield db.save("rights", form);

    if (res.id > 0) {
      return res;
    }
    throw errors.CUSTOM('虽然没出错，但也没有记录被更新。');

  },
  listRights : function*(qs) {
    var page = qs.page || 1;
    var size = qs.size || 20;

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

    return yield db.list("rights", {
      where  : where,
      params : queryParams,
      orderBy: "id desc",
      page   : page,
      size   : size,
      cols   : ['id', 'title', 'code', 'create_date', 'service_id']
    });

  },
  delRights  : function *(body) {

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
    return yield db.delById("rights", fID);

  },
  grant      : function*(form) {
    var account_id = form.account_id;
    var rights_id  = form.rights_id;

    var xright = yield db.load("user_rights", {
      where : "account_id=$account_id and rights_id=$rights_id",
      params: {account_id: account_id, rights_id: rights_id}
    });

    if (!xright) {
      return yield db.insert("user_rights", {account_id: account_id, rights_id: rights_id});
    }
    return true;
  },
  ungrant    : function*(form) {
    var account_id = form.account_id;
    var rights_id  = form.rights_id;

    yield db.del("user_rights", {
      where : "account_id=$account_id and rights_id=$rights_id",
      params: {account_id: account_id, rights_id: rights_id}

    });
    return true;

  },
  userRights : function*(qs) {
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

    return yield db.list("v_user_rights", {
      where  : where,
      params : queryParams,
      orderBy: "id desc",
      page   : page,
      size   : size
    });

  },


  saveAuto        : function *(serviceId, code, title) {
    var xRight = yield db.load('rights', {
      where : 'service_id=$service_id and code=$code',
      params: {service_id: serviceId, code: code}
    });
    if (!xRight) {
      xRight = yield db.insert('rights', {
        service_id: serviceId,
        code      : code,
        title     : title
      });
    }
    return xRight;
  },
  saveServiceAuto : function *(code) {
    var xservice = yield db.load('service', {
      where : "code=$code",
      params: {code: code}
    });
    if (!xservice) {
      xservice = yield db.insert('service', {code: code});
    }
    return xservice;
  },
  syncFromCloudeer: function *() {
    var config       = require('../config');
    var request      = require('request');
    var requestGetCo = function (url) {
      return function (callback) {
        request({url: url}, function (err, response, body) {
          callback(err, body);
        });
      }
    };
    var body     = yield requestGetCo(config.cloudeer.server + '/methods');
    var jMethods = JSON.parse(body);
    if (jMethods.errno == 0) {
      var xmethods = jMethods.data;
      for (var mt of xmethods) {
        var xservice = yield this.saveServiceAuto(mt.service);
        for (var mtd of mt.methods) {
          if (!mtd.open) {
            yield this.saveAuto(xservice.id, mtd.url, mtd.name);
          }
        }
      }
    } else {
      throw errors.CUSTOM(jMethods.errText);
    }
    return true;
  }
};