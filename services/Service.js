var db           = require('ezway2mysql');
var tools        = require('common-tools');
var errors       = require('cloudoll').errors;
var config       = require('../config');
var request      = require('request');
var rightService = require('./Right');


// var myTools      = require('../tools');

var Service = {
  save            : function *(tForm) {
    if (!tForm.title) {
      throw errors.WHAT_REQUIRE('标题');
    }
    if (!tForm.code) {
      throw errors.WHAT_REQUIRE('代码');
    }
    if (tForm.hasOwnProperty('id')) {
      tForm.id = parseInt(tForm.id);
    }

    if (tForm.id > 0) {
      return yield db.update('service', tForm);
    } else {
      return yield db.insert('service', tForm);
    }
  },
  saveAuto        : function *(code) {
    var xservice = yield db.loadByKV('service', 'code', code);
    if (!xservice) {
      xservice = yield db.insert('service', {code: code});
    }
    return xservice;
  },
  listAll         : function *(keyword, skip, limit) {
    skip       = skip || 0;
    limit      = limit || 1000;
    var where  = "1=1";
    var params = [];
    if (keyword) {
      where += " and title like ? or code like ?";
      params.push("%" + keyword + "%", "%" + keyword + "%");
    }
    return yield db.list("service", {
      where  : where,
      params : params,
      skip   : skip,
      limit  : limit,
      orderBy: "id desc"
    });
  },
  load            : function *(id) {
    return yield db.loadById('service', id);
  },
  delete          : function *(id) {
    var occ = yield db.load('right', {
      where : 'service_id=?',
      params: [id]
    });
    if (occ) {
      throw errors.WHAT_OCCUPIED('服务');
    }
    yield db.delete('service', {
      where : 'id=?',
      params: [id]
    });
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
        var xservice = yield Service.saveAuto(mt.service);
        for (var mtd of mt.methods) {
          if (!mtd.open) {
            yield rightService.saveAuto(xservice.id, mtd.url, mtd.name);
          }
        }
      }
    } else {
      throw errors.CUSTOM(jMethods.errText);
    }
  }
  // saveRight       : function *(service, title, code) {
  //
  // },
  // deleteRight     : function *(service, code) {
  //
  // },
  // clearRights     : function *(service) {
  //
  // }

};


module.exports = Service;