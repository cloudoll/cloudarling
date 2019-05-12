const errors = require("cloudoll").errors;
// const tools    = require("../../tools");


var Helper = {
  $captchaSend: async (ctx) => {
    // var qs   = ctx.qs;
    const form = ctx.request.body;

    const passport = form.passport;
    const rtn = await ycaptcha.sendCaptcha(passport);

    if (!rtn) {
      throw errors.CUSTOM("验证码发送失败。");
    }
    ctx.echo(true);
  },

  $captchaValidate: async (ctx) => {
    // var qs   = this.qs;
    const form = ctx.request.body;

    const passport = form.passport;
    const code = form.code;
    const rtn = await ycaptcha.validateCaptcha(passport, code);
    ctx.echo(rtn);
  }

};

module.exports = Helper;


