var errors         = require('cloudoll').errors;
var districtServie = require("../../yservice/YDistrict");
var tools          = require("../../tools");

var District = {
  children: function *() {
    var qs = this.qs;
    var id = qs.id || 0;
    var data = yield districtServie.getMyChildren(id);
    tools.responseJson(this, errors.success(data), qs);
  },
  family  : function *() {
    var qs   = this.qs;
    var id   = qs.id || 0;
    var data = yield districtServie.getMyFamily(id);
    tools.responseJson(this, errors.success(data), qs);
  },
  ancestor: function *() {
    var qs = this.qs;
    var id = qs.id || 0;
    var data = yield districtServie.getMyAncestor(id);
    tools.responseJson(this, errors.success(data), qs);
  }
};


module.exports = District;