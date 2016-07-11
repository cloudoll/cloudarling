// var program = require('commander');
//
// program
//   .version('0.0.1')
//   .option('-p, --port [type]', 'Server port')
//   .option('-e, --node_env [type]', 'Environment: product, development, test')
//   .parse(process.argv);
//
// var port    = program.port || 7301;
// var nodeEnv = program.node_env || "development";
//
//
// console.log("Start server @ port: %s, with node_env: %s", port, nodeEnv);
//
// process.env.NODE_ENV = nodeEnv;
// process.env.appName  = 'cloudarling';
// port                 = parseInt(port);

//-------------------------------
var doll           = require('cloudoll');
var config         = require('./config');
var url            = require('url');
var accountService = require('./services2/account');


//****************权限验证，所有的 admin 都需要 GOD_ADMIN 权限
var checkGodAdmin = function *(next) {
  var urls     = url.parse(this.url);
  var authCode = urls.pathname;
  authCode     = authCode.toLowerCase();
  if (authCode.indexOf('/admin') == 0) {
    var ticket = this.qs.ticket;
    if (!ticket) {
      throw doll.errors.WHAT_REQUIRE("ticket");
    }
    var rights = yield accountService.getInfoByTicket(ticket);
    if ((rights.account_type & 8) == 8) {
      yield  next;
    } else {
      throw doll.errors.NO_RIGHTS;
    }
  } else {
    yield  next;
  }
};
//888888888888888888888888888888


var app = new doll.KoaApplication({
  middles: [checkGodAdmin]
});

doll.orm.postgres.constr = config.postgres.conString;

// var mysql = doll.orm.mysql;
// mysql.connect(config.mysql);
// mysql.debug = true;

app.router.get('/', function *() {
  this.body = {msg: "亲，你好，我是怕死婆特。"};
});
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


