var serviceService = require('../services/Service');
var accountService = require('../services/Account');

var Account = {
  save            : function *() {
    var qs     = this.qs;
    var ticket = qs.ticket;
    yield accountService.checkGodAdmin(ticket);
    yield serviceService.save(this.request.body);
    this.body = {errno: 0};
  },
  listAll         : function *() {
    var qs      = this.qs;
    var ticket  = qs.ticket;
    var keyword = qs.keyword;
    var skip    = qs.skip || 0;
    var limit   = qs.limit || 1000;
    yield accountService.checkGodAdmin(ticket);
    var res   = yield serviceService.listAll(keyword, skip, limit);
    this.body = {errno: 0, data: res};
  },
  load            : function *() {
    var qs     = this.qs;
    var ticket = qs.ticket;
    yield accountService.checkGodAdmin(ticket);
    this.body = {errno: 0, data: yield serviceService.load(qs.id)};
  },
  delete          : function *() {
    var qs     = this.qs;
    var ticket = qs.ticket;
    yield accountService.checkGodAdmin(ticket);
    var form = this.request.body;
    yield serviceService.delete(form.id);
    this.body = {errno: 0};
  },
  syncFromCloudeer: function *() {
    var qs     = this.qs;
    var ticket = qs.ticket;
    yield accountService.checkGodAdmin(ticket);
    yield serviceService.syncFromCloudeer();
    this.body = {errno: 0};
  }
};

module.exports = Account;