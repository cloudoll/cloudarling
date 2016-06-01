var db    = require('ezway2mysql');
var Right = {
  saveAuto: function *(serviceId, code) {
    var xRight = yield db.load('right', {
      where : 'service_id=? and code=?',
      params: [serviceId, code]
    });
    if (!xRight) {
      xRight = yield db.insert('right', {
        service_id: serviceId,
        code      : code
      });
    }
    return xRight;
  }

};

module.exports = Right;