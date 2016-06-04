var db    = require('ezway2mysql');
var Right = {
  saveAuto             : function *(serviceId, code, title) {
    var xRight = yield db.load('right', {
      where : 'service_id=? and code=?',
      params: [serviceId, code]
    });
    if (!xRight) {
      xRight = yield db.insert('right', {
        service_id: serviceId,
        code      : code,
        title     : title
      });
    }
    return xRight;
  },
  list                 : function *(serviceId) {
    return yield db.list('right', {
      where : 'service_id=?',
      params: [serviceId],
      limit : 1000
    })
  },
  getAllRightsByAccount: function *(accountId) {
    return yield db.list('v_account_right', {
      where : 'account_id=?',
      params: [accountId],
      limit : 2000
    });
  },
  grantNow             : function *(accountId, rightId, action) {
    if (action == 'add') {
      yield db.insert("account_right", {
        account_id: accountId,
        right_id  : rightId
      });
    } else {
      yield db.delete('account_right', {
        where : 'account_id=? and right_id=?',
        params: [accountId, rightId]
      });
    }
    return true;
  }

};

module.exports = Right;