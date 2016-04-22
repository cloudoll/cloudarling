var request = require('request');

// request.post('http://localhost:7301/register', {form: {nick: 'qqq1', password: '111111'}}, function (err, res, body) {
//   console.log(body);
//
// });
//
// request.post('http://localhost:7301/login', {form: {passport: 'qqq1', password: '111111'}}, function (err, res, body) {
//   console.log(body);
//
// });
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


request.post('http://localhost:7301/3rd/login', {
  form: {
    provider: 'wechat',
    map_id  : '000111',
    nick    : 'we1113344'
  }
}, function (err, res, body) {
  console.log(body);
});

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

