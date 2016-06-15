var tools          = require('../../tools');
var errors         = require('cloudoll').errors;
var accountService = require('../../services/Account');
var myTools        = require('../../tools');

module.exports = {
  listAll                : function *() {
    var qs      = this.qs;
    var ticket  = qs.ticket;
    var keyword = qs.keyword;
    var skip    = qs.skip || 0;
    var limit   = qs.limit || 20;
    yield accountService.checkGodAdmin(ticket);
    var res   = yield accountService.listAll(keyword, skip, limit);
    this.body = {errno: 0, data: res};
  },
  $grantGod               : function *() {
    var form     = this.request.body;
    var acountId = form.account_id;
    var action   = form.action;

    var upRes = yield accountService.grantGod(acountId, action);
    // console.log(upRes);
    this.body = {errno: 0};
  }
};
