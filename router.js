/**
 * Created by xiezhengwei on 15/7/14.
 */

var router = require('koa-router')();


router.get('/', function *(next) {
  this.body = {msg: "亲，你好，我是怕死婆特。"};
});

var accountController = require('./controllers/Account');
router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.post('/change-password', accountController.changePassword);
router.get('/info', accountController.info);

router.post('/dynamic-password/send', accountController.sendDynamicPassword);
router.post('/dynamic-password/login', accountController.loginByDynamicPassword);

router.post('/3rd/login', accountController.loginFrom3rd);


router.get('/test', function *(next) {
  var db  = require('./share/db');
  var res = yield db.list('account', {
    where  : "id > ?",
    params : [0],
    orderBy: 'id desc, email',
    //cols:['id', ''],
    limit  : 20
  });
  // var res   = yield db.update('account', {
  //   id: 101,
  //    mobile : '13006699860',
  //   // email  : 'zhwell@sina.com',
  //   //open_id: 'dddd0111bbb1'
  // });
  this.body = res;
});


// var AccountStateless = require("./controllers/AccountStateless");
// router.get('/v2/login-by-cookie', AccountStateless.loginByCookie);
// router.post('/v2/login', AccountStateless.login);
// router.get('/v2/refresh-ticket', AccountStateless.refreshTicket);
// router.get('/v2/user/all', AccountStateless.getUserAll);
// router.get('/v2/user/info', AccountStateless.getUserInfo);
// router.get('/v2/user/rights', AccountStateless.getUserRights);
// router.get('/v2/user/devices', AccountStateless.getUserDevices);
// router.post('/register', AccountStateless.register);
//
// var Address = require("./controllers/Address");
// router.get('/address', Address.getDefault);
// router.get('/address/list', Address.list);
// router.post('/address', Address.add);
// router.post('/address/update', Address.update);
// router.post('/address/delete', Address.del);
// router.post('/address/set-as-default', Address.setDefault);
//
//
// var Helper = require("./controllers/Helper");
// router.post('/send-captcha', Helper.sendCaptcha);
// router.post('/validate-captcha', Helper.validateCaptcha);
//
//
// var District = require("./controllers/District");
// router.get("/district/children", District.getMyChildren);
// router.get("/district/family", District.getMyFamily);
// router.get("/district/ancestor", District.getMyAncestor);
//
//
//
// var adminAccount = require('./controllers/admin/Account');
// router.get("/admin/account/list", adminAccount.list);
//
// var adminRight = require('./controllers/admin/Right');
// router.get("/admin/service/list", adminRight.listService);
// router.get("/admin/rights/list", adminRight.listRights);
// router.get("/admin/user-rights/list", adminRight.listUserRights);
// router.post("/admin/service/edit", adminRight.editService);
// router.post("/admin/rights/edit", adminRight.editRights);
// router.post("/admin/rights/grant", adminRight.grant);
// router.post("/admin/rights/ungrant", adminRight.ungrant);
// router.post("/admin/service/delete", adminRight.delService);
// router.post("/admin/rights/delete", adminRight.delRights);


//router.get("/test1", function *() {
//    this.body = "1234";
//});
//
//
//router.get("/test2", function *() {
//   var res = yield x("hello");
//    this.body = res;
//});
//
//function x(xyz){
//    return function( callback){
//      setTimeout(function(){
//          callback(null, "1234" + xyz);
//      }, 10000);
//    };
//}
//

module.exports = router;
