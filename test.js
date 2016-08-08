var request = require('request');

var ticket = "eyJvcGVuX2lkIjoiOTEyYzNkMjAtNDcxZi0xMWU2LTk0M2YtMDI0MmFjMTEwMDAxIiwiZXhwaXJlc19pbiI6MTQ3MDY0MjI1Niwic2lnbiI6IjBjNDYzMjdlNzI4YTEwMDc0YTllOWUyNjY2NzU3NzJiYzE0YTg3NTQ5MjM4NjI5YWU2N2IxNzA1NTkzMGUyZDkifQ==";
// request.post('http://localhost:7301/open/account/login',
//   {
//     form: {passport: '13006699866', password: '111111'}
//   }, function (err, res, body) {
//     console.log(body);
//   });

// request.post('http://localhost:7301/open/account/register',
//   {
//     form: {mobile: '13006699866', password: '111111'}
//   }, function (err, res, body) {
//     console.log(body);
//   });

// request.post('http://localhost:7301/admin/role/edit-user?ticket=' + ticket,
//   {
//     form: {account_id: '1', role_id: '1'}
//   }, function (err, res, body) {
//     console.log(body);
//   });

request.post('http://localhost:7301/admin/role/edit-rights?ticket=' + ticket,
  {
    form: {role_id: '1', rights_id: '2'}
  }, function (err, res, body) {
    console.log(body);
  });


// request.post('http://localhost:7301/admin/role/save?ticket=' + ticket,
//   {
//     form: {title: '客服'}
//   }, function (err, res, body) {
//     console.log(body);
//   });
//

// var x = {
//   ticket: 'eyJvcGVuX2lkIjoiNTljNDViNzhhZDE1NGYzMmI3NGNhMDUyMzlhY2M5Y2EiLCJleHBpcmVzX2luIjoxNDY1ODk3Mzk2LCJzaWduIjoiNTk3MDQ2ZjliOWI0ZWUzNzU3YjZiOTQxNmE5Y2I3ZjFhMGExMTY2MTEzNGQ0Y2Y5NmEzZTgyOTRiOGJjNGQ2NiJ9'
//   ,service: 'cloudarling'
// };
//
// console.log(require('querystring').stringify(x));
//request.post('http://localhost:7301/register', {form: {mobile: '13006699866', password: '111111'}}, function (err, res, body) {
//  console.log(body);
//});


// var data = {
//   method    : 'load',
//   table     : 'account',
//   conditions: {
//     where : 'id>?',
//     params: [1]
//   }
// };
//
// var tools        = require('common-tools');
// var base64String = tools.stringTools.base64Encode(data);
// console.log(base64String);

//
//  request.post('http://localhost:7301/login', {form: {passport: 'cloudbeer@gmail.com', password: '111111'}}, function (err, res, body) {
//    console.log(body);
//  });
// request.post('http://localhost:7301/change-password', {
//   form: {
//     ticket  : 'eyJvcGVuX2lkIjoiMWU3NmUzZDU5OGU3NDc2MWE3OWRiNDI5OTQyOTJmNmIiLCJleHBpcmVzX2luIjoxNDYxMjE2MzY0LCJzaWduIjoiMDJlNGYxOWZlMzUyMDVlMjJhY2FjOWE1MzRjYTlhNDM4NzYwOGEzZDRiOTIzMzk3Y2VjMjQ0MzkzN2RjNWY1ZiJ9',
//     password: '222'
//   }
// }, function (err, res, body) {
//   console.log(body);
//
// });


// request.post('http://localhost:7301/dynamic-password/send', {form: {passport: '13006699866'}}, function (err, res, body) {
//   console.log(body);
// });

// request.post('http://localhost:7301/dynamic-password/login', {
//   form: {
//     passport: '13006699866',
//     password: '232668',
//     ticket  : 'eyJzaWduIjoiOTQwNzQ0YjhkYjQ2NmFhNzViMWU1N2RlZDlkOWFjZTdkNGFmMDE1ZGYzY2U0NWMwMjhhNTE3MjNmMTdkMGEwOCIsImV4cGlyZXNfaW4iOjE0NjEyODgzMzB9'
//   }
// }, function (err, res, body) {
//   console.log(body);
// });
//
//
// request.post('http://localhost:7301/3rd/login', {
//   form: {
//     provider: 'wechat',
//     map_id  : '000111',
//     nick    : 'we1113344'
//   }
// }, function (err, res, body) {
//   console.log(body);
// });

// var tools = require('./tools');
//
// console.log(tools.makeTicketTemp('13006699866', '32122'));
//
// console.log(tools.validateTicketTemp('13006699866', '32122', 'eyJzaWduIjoiZjZlMDM5MGMyMTNkOWFkOTJmOTgxOGU2YzkyNTE3NjcwODhiMDgxZjNjNDdhYWEzOTE2ZTc3ZjNkMGY5ZjhjNiIsImV4cGlyZXNfaW4iOjE0NjEyMjcxODB9'));
//
//

// var co = require('co');
//
// var service = require('./services/Account');
//
// co(function *() {
//     var res = yield service.loginFrom3rd('wechat', '0000001', '啤酒云');
//
//     console.log(res);
//
//   }
// );


// request.post("http://passport.youkutv.com/v2/login", {
//   form:{
//     passport:"13006699866",
//     password:"xxxxxxx"
//   }
// },function (err, res, body) {
//   console.log(body);
// });
