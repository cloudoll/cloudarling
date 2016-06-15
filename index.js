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
var doll   = require('cloudoll');
var config = require('./config');


var app    = new doll.KoaApplication();

var mysql = doll.orm.mysql;
mysql.connect(config.mysql);
mysql.debug = true;

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


