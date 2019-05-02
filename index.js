
const doll = require('cloudoll');
// const config = require('./config');
const url = require('url');
const accountService = require('./app/services/account');
const querystring = require("querystring");


//****************权限验证，所有的 admin 都需要 GOD_ADMIN 权限
let checkGodAdmin = async (ctx, next) => {
  let urls = url.parse(ctx.url);
  let authCode = urls.pathname;

  authCode = authCode.toLowerCase();
  
  if (authCode.indexOf('/admin') == 0) {
    let qs = querystring.parse(ctx.request.querystring);
    let ticket = qs.ticket;
    if (!ticket) {
      throw doll.errors.WHAT_REQUIRE("ticket");
    }
    let rights = await accountService.getInfoByTicket(ticket, ctx.app.config.account.public_key);
    console.log(rights);
    if ((rights.account_type & 8) == 8) {
      await next();
    } else {
      throw doll.errors.NO_RIGHTS;
    }
  } else {
    await next();
  }
};
//888888888888888888888888888888


let app = new doll.WebApplication({
  middles: [checkGodAdmin]
});

// doll.orm.postgres.connect(app.config.postgres);
//doll.orm.postgres.constr = config.postgres.conString;

var mysql = doll.orm.mysql;
mysql.debug = app.config.debug;
mysql.connect(app.config.mysql);

app.router.get('/',  ctx => {
  ctx.body = { msg: "亲，你好，我是怕死婆特。" };
});

app.startService();
// console.log(process.env);


// var Clouderr = require('cloudoll').Clouderr;
// var errors   = require('cloudoll').errors;

// var KoaMiddle = require('cloudoll').KoaMiddle;
// var koaMiddle = new KoaMiddle();
//
// app.use(json());
// app.use(bodyParser());
//
// // app.use(serve("./static"));
// app.use(koaMiddle.errorsHandleAhead);
//
// app.use(koaMiddle.queryStringParser);
//
// var router = require("./router");
// app.use(router.routes());
//
// app.use(koaMiddle.errorsHandleBehind);
// app.listen(port);
//
//
// var db = require('cloudoll').orm.mysql;
// // var cloudarkTools = require('cloudark-tools');
// db.connect(config.mysql);
// // db.debug = true;
//
// // app.use(cloudarkTools.koaMiddleware.ezway2mysql);
//
//
// //cache district
// //require("./yservice/YDistrict").getAllFromDB();
//
// var Cloudeer = require('cloudoll').Cloudeer;
//
// var cloudeer = new Cloudeer({
//   cloudeerUri: config.cloudeer.serviceHost,
//   myHost     : config.cloudeer.myHost,
//   myPort     : port
// });
//
//
// if (!config.cloudeer.disabled) {
//   cloudeer.registerService();
// }
//
// cloudeer.downloadService();


