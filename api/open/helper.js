var errors   = require("cloudoll").errors;
var tools    = require("../../tools");


var Helper = {
  $captchaSend: function *(next) {
    var qs   = this.qs;
    var form = this.request.body;

    var passport = form.passport;
    var rtn      = yield ycaptcha.sendCaptcha(passport);

    if (!rtn) {
      throw errors.CUSTOM("验证码发送失败。");
    }
    this.body = errors.success(true);
  },

  $captchaValidate: function *() {
    var qs   = this.qs;
    var form = this.request.body;

    var passport = form.passport;
    var code     = form.code;
    var rtn = yield ycaptcha.validateCaptcha(passport, code);
    this.body = errors.success(rtn);

  }

};

module.exports = Helper;


