var service        = require('../services/Right');
var accountService = require('../services/Account');
var errors         = require("cloudoll").errors;

var Account = {
  list            : function *() {
    var qs     = this.qs;
    var ticket = qs.ticket;
    yield accountService.checkGodAdmin(ticket);

    this.body = errors.SUCCESS(yield service.list(qs.service_id));
  },
  listAllByAccount: function *() {
    var qs     = this.qs;
    var ticket = qs.ticket;
    yield accountService.checkGodAdmin(ticket);

    if (!qs.account_id) {
      throw errors.WHAT_REQUIRE('account_id');
    }
    var accountId = parseInt(qs.account_id);
    this.body     = errors.success(yield service.getAllRightsByAccount(accountId));

  },
  grantRight      : function *() {
    var qs     = this.qs;
    var ticket = qs.ticket;
    yield accountService.checkGodAdmin(ticket);

    var form      = this.request.body;
    var accountId = parseInt(form.account_id);
    if (!accountId) {
      throw errors.WHAT_REQUIRE('account_id');
    }
    var rightID = parseInt(form.right_id);
    if (!rightID) {
      throw errors.WHAT_REQUIRE('right_id');
    }
    var action = "remove";
    if (form.action) {
      action = form.action;
    }

    this.body = errors.success(yield service.grantNow(accountId, rightID, action));

  }
};

module.exports = Account;