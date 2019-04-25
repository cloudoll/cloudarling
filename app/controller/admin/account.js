const accountService = require('../../services/account');

module.exports = {
  list     : function*() {
    var rtn = yield accountService.adminList(this.qs);
    this.echo(rtn);
  },
  $grantGod: function *() {
    this.echo(yield accountService.grantGod(this.request.body.id));
  },
  $save: function *() {    
    this.echo(yield accountService.update(this.request.body));    
  }
};