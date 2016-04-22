var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --port [type]', 'Server port')
  .option('-e, --node_env [type]', 'Environment: product, development, test')
  .parse(process.argv);

var port    = program.port || 7301;
var nodeEnv = program.node_env || "development";


console.log("Start server @ port: %s, with node_env: %s", port, nodeEnv);

process.env.NODE_ENV = nodeEnv;
port                 = parseInt(port);

//-------------------------------

var koa        = require('koa');
var bodyParser = require('koa-bodyparser');
var json       = require('koa-json');
var config     = require('./config');
var serve      = require('koa-static');
var app        = koa();

app.use(json());
app.use(bodyParser());

app.use(serve("./static"));


app.use(function*(next) {
  try {
    yield next;
  } catch (err) {
    this.app.emit('error', err, this);
    this.body = {errno: err.errno || -1, errText: err.message};
  }
});


var router = require("./router");
app.use(router.routes());


app.listen(port);


//cache district
//require("./yservice/YDistrict").getAllFromDB();

if (!config.cloudeer.disabled) {

  console.log('开始向 cloudeer 注册中心注册...');
  var request = require('request');
//注册微服务。5s 每次。
  var regUrl  = `${config.cloudeer.serviceHost}/register?name=${config.cloudeer.myName}&host=${config.cloudeer.myHost}&port=${port}`;
  setInterval(function () {
    request(regUrl, function (err, body) {
      if (err) {
        console.log(regUrl);
        console.log('cloudeer 注册中心连接不上，请联系管理员，或者可以在 config 里禁用此功能。');
      }
    });
  }, 8000);
}

