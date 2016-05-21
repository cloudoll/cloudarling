#!/usr/bin/env node

var program = require('commander');
var tools   = require('common-tools');

program
  .version('0.0.1')
  .usage('-m cloudbeer@gmail.com -p passWord!')
  .option('-m, --email [email]', 'Email （必须填写）')
  .option('-p, --password [password]', 'Password （必须填写）')
  .option('-e, --node_env [node_env]', 'Environment: product, development, test')
  .parse(process.argv);

var email            = program.email;
var password         = program.password;
var nodeEnv          = program.node_env || "development";
process.env.NODE_ENV = nodeEnv;

if (!email || !password) {
  program.outputHelp();
  return;
}

if (!tools.validateTools.isEmail(email)) {
  console.log('请输入正确的 email');
  return;
}

var reginfo = {
  email    : email,
  password : password,
  user_type: 9
};


var co             = require('co');
var accountService = require('./services/Account');
var ezmysql        = require('ezway2mysql');
var config         = require('./config');
ezmysql.connect(config.mysql);

//TODO: 这里要加入建表操作。



// var co = accountService.register(reginfo);
// while (!co.next().done){
//   console.log(co.next());
//   (co.value)(function (err, res) {
//     console.log(res);
//   });
//   //console.log(co.next());
// }
//console.log(co.next());
//co.next().val();
var xco = co(function *() {
  // console.log('开始注册...', reginfo);
  var res = yield accountService.register(reginfo);
  console.log(res);
  console.log("你创建的超级管理员帐号是：");
  console.log(`用户名： ${program.email}`);
  console.log(`密码：${program.password}`);
  console.log("现在请按 ^C 退出。");

}).catch(function (reson) {
  console.log(reson);
  console.log("现在请按 ^C 退出。");
});

// console.log(xco);
// xco.then(function (err, res) {
//   console.log('eeee');
//   console.log(res);
// }).catch(function (reson) {
//   console.log(reson);
// });
// var xco2 = co(xco);
// console.log(xco2);


