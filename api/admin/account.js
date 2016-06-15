var accountService = require('../../services2/account');
var tools          = require("../../tools");
var errors         = require('cloudoll').errors;

module.exports = {
  list: function*() {
    var rtn = yield accountService.adminList(this.qs);
    tools.responseJson(this, errors.success(rtn), this.qs);
  }
};