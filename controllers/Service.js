var tools          = require('../tools');
var querystring    = require("querystring");
var errors         = require('common-rest-errors');
var serviceService = require('../services/Service');
var accountService = require('../services/Account');
var myTools        = require('../tools');

var Account = {
  listAll                : function *() {
    var qs      = querystring.parse(this.request.querystring);
    var ticket  = qs.ticket;
    var keyword = qs.keyword;
    var skip    = qs.skip || 0;
    var limit   = qs.limit || 1000;
    yield accountService.checkGodAdmin(ticket);
    var res   = yield serviceService.listAll(keyword, skip, limit);
    this.body = {errno: 0, data: res};
  }
};

module.exports = Account;