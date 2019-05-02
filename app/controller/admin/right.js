const errors       = require("cloudoll").errors;
const rightService = require('../../services/right');
const tools        = require("../../tools");


module.exports = Right = {

  $editService    : function*() {
    this.body = errors.success(yield rightService.editService(this.request.body));
  },
  $delService     : function *() {
    this.body = errors.success(yield rightService.delService(this.request.body));
  },
  listService     : function*() {
    var rtn = yield rightService.listService(this.qs);
    tools.responseJson(this, errors.success(rtn), this.qs);
  },
  $editRights     : function *() {
    this.body = errors.success(yield rightService.editRights(this.request.body));
  },
  listRights     : function*() {
    var rtn = yield rightService.listRights(this.qs);
    tools.responseJson(this, errors.success(rtn), this.qs);
  },
  $delRights      : function *() {
    this.body = errors.success(yield rightService.delRights(this.request.body));
  },
  $grant          : function*() {
    this.body = errors.success(yield rightService.grant(this.request.body));

  },
  $ungrant        : function*() {
    this.body = errors.success(yield rightService.ungrant(this.request.body));

  },
  userRights      : function*() {
    var rtn = yield rightService.userRights(this.qs);
    tools.responseJson(this, errors.success(rtn), this.qs);
  },
  syncFromCloudeer: function *() {
    this.body = errors.success(yield rightService.syncFromCloudeer());
  }
};