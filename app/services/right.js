var db = require('cloudoll').orm.mysql;
var tools = require('common-tools');
var errors = require('cloudoll').errors;
var myTools = require('../tools');


module.exports = {

  editService: async (form) => {
    var fID = parseInt(form.id);
    if (!fID) {
      delete form.id;
    }
    var res = await db.save("service", form);

    if (res.id > 0) {
      return res;
    }
    throw errors.CUSTOM('虽然没出错，但也没有记录被更新。');
  },
  delService: async (form) => {
    var fID = parseInt(form.id);
    if (!fID || fID <= 0) {
      throw errors.WHAT_NOT_FOUND('服务 id');
    }

    var xright = await db.load("rights", {
      where: "service_id=?",
      params: [fID]
    });
    if (xright) {
      throw errors.WHAT_OCCUPIED("该服务");
    }
    return await db.delById("service", fID);
  },
  listService: async (qs) => {

    var page = qs.page || 1;
    var size = qs.size || 20;

    var where = "1=1", queryParams = [];

    var tt = qs.title;

    if (tt) {
      where += " and title like ?";
      queryParams.push('%' + tt + '%');
    }

    return await db.list("service", {
      where: where,
      params: queryParams,
      orderBy: "id desc",
      page: page,
      size: size,
      cols: ['id', 'title', 'code', 'create_date']
    });
  },
  editRights: async (form) => {
    var fID = parseInt(form.id);
    if (!fID) delete form.id;

    var res = await db.save("rights", form);

    if (res.id > 0) {
      return res;
    }
    throw errors.CUSTOM('虽然没出错，但也没有记录被更新。');

  },
  listRights: async (qs) => {
    var page = qs.page || 1;
    var size = qs.size || 20;

    var where = "1=1", queryParams = [];

    var tt = qs.title;
    var service_id = qs.service_id;

    if (tt) {
      where += " and title like ?";
      queryParams.push('%' + tt + '%');
    }
    if (service_id) {
      where += " and service_id=?";
      queryParams.push(service_id);

    }

    return await db.list("rights", {
      where: where,
      params: queryParams,
      orderBy: "id desc",
      page: page,
      size: size,
      cols: ['id', 'title', 'code', 'create_date', 'service_id']
    });

  },
  delRights: async (body) => {

    var fID = parseInt(form.id);
    if (!fID || fID <= 0) {
      throw errors.WHAT_WRONG_FORMAT("ID");
    }

    var xright = await db.load("user_rights", {
      where: "rights_id=?",
      params: [fID]
    });
    if (xright) {
      throw errors.WHAT_OCCUPIED("该权限");
    }
    return await db.delById("rights", fID);

  },
  grant: async (form) => {
    var account_id = form.account_id;
    var rights_id = form.rights_id;

    var xright = await db.load("user_rights", {
      where: "account_id=? and rights_id=?",
      params: [account_id, rights_id]
    });

    if (!xright) {
      return await db.insert("user_rights", { account_id: account_id, rights_id: rights_id });
    }
    return true;
  },
  ungrant: async (form) => {
    var account_id = form.account_id;
    var rights_id = form.rights_id;

    await db.del("user_rights", {
      where: "account_id=? and rights_id=?",
      params: [account_id, rights_id]

    });
    return true;

  },
  userRights: async (qs) => {
    var page = qs.page || 1;
    var size = qs.size || 20;

    var account_id = qs.account_id;
    if (!account_id) {
      throw errors.WHAT_REQUIRE('account_id');
    }
    var where = "account_id=?", queryParams = [account_id];

    var service_id = qs.service_id;

    if (service_id) {
      where += " and service_id=?";
      queryParams.push(service_id);

    }

    return await db.list("v_user_rights", {
      where: where,
      params: queryParams,
      orderBy: "id desc",
      page: page,
      size: size
    });

  },


  saveAuto: async  (serviceId, code, title) =>{
    var xRight = await db.load('rights', {
      where: 'service_id=? and code=?',
      params: [  serviceId,  code ]
    });
    if (!xRight) {
      xRight = await db.insert('rights', {
        service_id: serviceId,
        code: code,
        title: title
      });
    }
    return xRight;
  },
  saveServiceAuto: async  (code) => {
    var xservice = await db.load('service', {
      where: "code=?",
      params: [code]
    });
    if (!xservice) {
      xservice = await db.insert('service', { code: code });
    }
    return xservice;
  },
  // syncFromCloudeer: async () => {
  //   var config = require('../config');
  //   var request = require('request');
  //   var requestGetCo = function (url) {
  //     return function (callback) {
  //       request({ url: url }, function (err, response, body) {
  //         callback(err, body);
  //       });
  //     }
  //   };
  //   var body = await requestGetCo(config.cloudeer.server + '/methods');
  //   var jMethods = JSON.parse(body);
  //   if (jMethods.errno == 0) {
  //     var xmethods = jMethods.data;
  //     for (var mt of xmethods) {
  //       var xservice = await this.saveServiceAuto(mt.service);
  //       for (var mtd of mt.methods) {
  //         if (!mtd.open) {
  //           await this.saveAuto(xservice.id, mtd.url, mtd.name);
  //         }
  //       }
  //     }
  //   } else {
  //     throw errors.CUSTOM(jMethods.errText);
  //   }
  //   return true;
  // }
};