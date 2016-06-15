var serviceService = require('../../services/Service');
var errors         = require('cloudoll').errors;

var Account = {
  $save           : function *() {
    yield serviceService.save(this.request.body);
    this.body = {errno: 0};
  },
  listAll         : function *() {
    var qs      = this.qs;
    var keyword = qs.keyword;
    var skip    = qs.skip || 0;
    var limit   = qs.limit || 1000;
    var res     = yield serviceService.listAll(keyword, skip, limit);
    this.body   = errors.success(res);
  },
  load            : function *() {
    this.body = errors.success(yield serviceService.load(this.qs.id));
  },
  $delete         : function *() {
    var form = this.request.body;
    yield serviceService.delete(form.id);
    this.body = {errno: 0};
  },
  syncFromCloudeer: function *() {
    yield serviceService.syncFromCloudeer();
    this.body = {errno: 0};
  }
};

module.exports = Account;