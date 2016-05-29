var db      = require('ezway2mysql');
var tools   = require('common-tools');
var myTools = require('../tools');
var errors  = require('common-rest-errors');
var config  = require('../config');

var Service = {
  listAll : function *(keyword, skip, limit) {
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
  saveRight: function *(service, title, code) {

  },
  deleteRight: function *(service,  code) {

  },
  clearRights: function *(service) {

  }

};


module.exports = Service;