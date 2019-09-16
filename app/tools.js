const request = require("cloudoll").request;
const querystring = require("querystring");
const errors = require('cloudoll').errors;
const myTools = require('cloudoll').tools;

const config = {}; //TODO: this config for what?
var tools = {
  base64Encode: function (data) {
    return myTools.base64Encode(JSON.stringify(data));
    // new Buffer(JSON.stringify(data)).toString('base64');
  },
  base64Decode: function (data) {
    return myTools.base64Decode(data);
    // return new Buffer(data, 'base64').toString();
  },
  sha256: function (data, salt) {
    return require("sha256")(data + salt);
  },
  computeSign: function (data) {
    var msg = tools.base64Encode(data);
    var privateKey = require('fs').readFileSync('./rsa_private_key.pem').toString();
    var key = new NodeRSA(privateKey);
    key.setOptions({ signingScheme: "sha1" });
    return key.sign(msg, "base64");
  },
  responseJsonp: function (ctx, msg, querystring) {
    if (querystring.callback) {
      ctx.type = "application/javascript";
      ctx.body = querystring["callback"] + "(" + msg + ")";
    } else {
      ctx.body = JSON.parse(msg);
    }
  },
  responseJson: function (ctx, msg, querystring) {
    if (querystring.callback) {
      ctx.type = "application/javascript";
      ctx.body = querystring["callback"] + "(" + JSON.stringify(msg) + ")";
    } else {
      ctx.body = msg;
    }
  },
  apiGet: function (httpMethod, data, apiType) {

    return function (callback) {
      request.post({
        url: config.innerproxy, form: {
          client_id: config.client_id,
          http_method: "GET",
          api_method: httpMethod,
          data: data,
          api_type: apiType || "passport",
          sign: tools.computeSign(data)
        }
      }, function (error, response, body) {
        if (error) {
          console.log(error);
          callback(error);
        } else {
          callback(null, body);
        }
      });

    };
  },
  apiPost: function (httpMethod, data, apiType) {

    return function (callback) {
      request.post({
        url: config.innerproxy, form: {
          client_id: config.client_id,
          http_method: "POST",
          api_method: httpMethod,
          data: data,
          api_type: apiType || "passport",
          sign: tools.computeSign(data)
        }
      }, function (error, response, body) {
        if (error) {
          console.log(error);
          callback(error);
        } else {
          callback(null, body);
        }
      });

    };
  },
  isEmail: function (email) {
    var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  },
  isChinaMobile: function (mobile) {
    var re = /^1[0-9]{10}$/i;
    return re.test(mobile);

  },
  genRdmStr: function (howMany, chars) {
    chars = chars
      || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = require("crypto").randomBytes(howMany)
      , value = new Array(howMany)
      , len = chars.length;

    for (var i = 0; i < howMany; i++) {
      value[i] = chars[rnd[i] % len]
    }
    return value.join('');
  },
  genSmsCaptach: function () {
    return tools.genRdmStr(6, "1234567890");
  },
  genUUID: function (noSlash) {
    var uuid = require("uuid");
    var rtn = uuid.v4();
    if (noSlash)
      rtn = rtn.replace(/-/gi, "");
    return rtn;
  },
  genPassword: function (password) {
    var salt = tools.genRdmStr(12);
    var sha256Pwd = tools.sha256(password + salt);
    return { salt: salt, password: sha256Pwd };
  },
  sendSms: function* (mobile, sms, ip) {
    return yield tools.apiPost("/sms/message/send_new.json", {
      token: config.sms.token,
      posts: '["' + mobile + '"]',
      content: sms,
      sms_class: "2",
      ip: ip
    }, "sms");
  },
  getTimeStamp: function () {
    return Math.round(new Date().getTime() / 1000);
  },
  makeTicket: function (open_id, expires_in, config) {
    var xtick = {}, xtoken = {}; //token 是临时令牌
    //pires_in = expires_in || tools.getTimeStamp() + 24 * 3600; //默认保存一天
    xtick.open_id = open_id; xtoken.open_id = open_id;
    var intExpires = 0;
    if (expires_in) {
      intExpires = parseInt(expires_in);
    } else {
      intExpires = tools.getTimeStamp() + config.account.expire_in;
    }
    xtick.expires_in = intExpires;
    xtoken.expire_in = tools.getTimeStamp() + 10; //10秒过期
    const xtickStr = JSON.stringify(xtick), xtokenStr = JSON.stringify(xtoken);
    xtick.sign = tools.sha256(xtickStr + config.account.public_key);
    xtoken.sign = tools.sha256(xtokenStr + config.account.public_key);
    const xtickStrLast = tools.base64Encode(xtick), xtokenStrLast = tools.base64Encode(xtoken);

    return { ticket: xtickStrLast, expires_in: intExpires, token: xtokenStrLast };
  },
  getOpenId: function (ticket, pubKey) {
    ticket = querystring.unescape(ticket);
    var tkJson = null;

    try {
      ticket = tools.base64Decode(ticket);
      tkJson = JSON.parse(ticket);
    } catch (e) {
      throw errors.TICKET_ILLEGAL;
    }
    var expiresIn = tkJson.expires_in;

    var tsNow = tools.getTimeStamp();
    if (expiresIn < tsNow) {
      throw errors.TICKET_EXPIRED;
    }

    var xtick = {};
    xtick.open_id = tkJson.open_id;
    xtick.expires_in = tkJson.expires_in;
    var xtickStr = JSON.stringify(xtick);
    var xsign = tools.sha256(xtickStr + pubKey);

    if (xsign != tkJson.sign) {
      throw errors.TICKET_VERIFY_FAILED;
    }
    if (!tkJson.open_id) throw errors.WHAT_NOT_FOUND("ticket 中的 open_id");

    return tkJson.open_id;
  },
  //临时ticket生产器,
  makeTicketTemp: function (passport, code, expires_in) {
    var xtick = {};
    var intExpires = 0;
    if (expires_in) {
      intExpires = parseInt(expires_in);
    } else {
      intExpires = tools.getTimeStamp() + config.account.dynamic_password_expire_in;
    }
    xtick.sign = tools.sha256(passport + code + intExpires + config.account.public_key);
    xtick.expires_in = intExpires;

    var xtickStrLast = tools.base64Encode(xtick);

    return { ticket: xtickStrLast, expires_in: intExpires };
  },
  validateTicketTemp: function (passport, code, ticket) {
    ticket = querystring.unescape(ticket);
    var tkJson = null;

    try {
      ticket = tools.base64Decode(ticket);
      tkJson = JSON.parse(ticket);
    } catch (e) {
      throw errors.TICKET_ILLEGAL;
    }
    var expiresIn = tkJson.expires_in;

    var tsNow = tools.getTimeStamp();
    if (expiresIn < tsNow) {
      throw errors.TICKET_EXPIRED;
    }

    var sign = tkJson.sign;

    var newSign = tools.sha256(passport + code + expiresIn + config.account.public_key);
    return sign === newSign;
  },
  charMode: function (iN) {
    if (iN >= 48 && iN <= 57) //数字（U+0030 - U+0039）
      return 1; //二进制是0001
    if (iN >= 65 && iN <= 90) //大写字母（U+0041 - U+005A）
      return 2; //二进制是0010
    if (iN >= 97 && iN <= 122) //小写字母（U+0061 - U+007A）
      return 4; //二进制是0100
    else //其他算特殊字符
      return 8; //二进制是1000
  },
  passwordStrength: function (sPW) {
    if (sPW.length < 5) //小于7位，直接“弱”
      return 0;
    var Modes = 0;
    for (i = 0; i < sPW.length; i++) { //密码的每一位执行“位运算 OR”
      Modes |= tools.charMode(sPW.charCodeAt(i));
    }
    return Modes;
  }


};

module.exports = tools;
