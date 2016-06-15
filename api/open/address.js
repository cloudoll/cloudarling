var errors         = require("cloudoll").errors;
var stringTools    = require("common-tools").stringTools;
var tools          = require("../../tools");
var accountService = require('../../services2/account');
var addressService = require('../../services2/address');

var Address = {
  $add       : function *() {
    this.body = errors.success(yield addressService.add(this.request.body));
  },
  $update    : function *() {
    this.body = errors.success(yield addressService.update(this.request.body));
  },
  $delete    : function *() {
    this.body = errors.success(yield addressService.delete(this.request.body));
  },
  $setDefault: function *() {
    this.body = errors.success(yield addressService.setDefault(this.request.body));
  },
  list       : function *() {
    var rtn = yield addressService.list(this.qs.ticket);
    tools.responseJson(this, {errno: 0, data: rtn}, this.qs);
  },
  default    : function *() {
    var rtn = yield addressService.getDefault(this.qs);
    tools.responseJson(this, {errno: 0, data: rtn}, this.qs);
  },
  one        : function *() {
    var rtn = yield addressService.getAddressById(this.qs);
    tools.responseJson(this, {errno: 0, data: rtn}, this.qs);
  }
};

module.exports = Address;