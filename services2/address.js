var db              = require('cloudoll').orm.postgres;
var errors          = require('cloudoll').errors;
var stringTools     = require('common-tools').stringTools;
var accountService  = require('./account');
var districtService = require('./district');
var config          = require('../config');

module.exports = {
  list: function *(ticket) {
    var user = yield accountService.getInfoByTicket(ticket);

    return yield db.take("address", {
      where : "account_id=$accountId",
      params: {accountId: user.id},
      cols  : ["id", "district_id", "district", "address", "postcode", "cnee", "tel1", "tel2", "im", "address_status"]
    });
  },
  add : function *(form) {

    if (!form.district_id) {
      throw errors.WHAT_REQUIRE("地区ID【district_id】");
    }
    if (!form.cnee) {
      throw errors.WHAT_REQUIRE("收货人【cnee】");
    }

    if (!form.address) {
      throw errors.WHAT_REQUIRE("具体地址【address】");
    }
    if (!form.tel1) {
      throw errors.WHAT_REQUIRE("联系电话【tel1】");
    }
    form.cnee    = stringTools.htmlEncode(form.cnee);
    form.address = stringTools.htmlEncode(form.address);

    var ticket = form.ticket;
    delete form.ticket;

    var user = yield accountService.getInfoByTicket(ticket);

    var cnt = yield db.count("address", {
      where : "account_id=$accountId",
      params: {accountId: user.id}
    });

    var maxAddressCount = 100;
    if (config.address && config.address.max_count) {
      maxAddressCount = config.address.max_count;
    }

    if (cnt.count >= maxAddressCount) {
      throw errors.WHAT_TOO_MUCH("您的地址");
    }


    var districtObj = yield districtService.getMyAncestor(form.district_id);

    if (districtObj) {
      form.district = districtObj.reduce(function (prev, ele) {
        return prev + " " + ele.title;
      }, "");
    }

    form.account_id = user.id;

    var addStatus = parseInt(form.address_status) || 1;
    if (addStatus > 2 || addStatus < 1) addStatus = 1;
    if (form.address_status == 2) {
      //插入默认地址需要将之前的地址置为 1
      yield db.updateBatch("address", {address_status: 1}, {
        where : "account_id=$accountId",
        params: {accountId: user.id}
      });
    }
    return yield db.insert("address", form, ["id"]);

  },

  update: function *(form) {
    var ticket = form.ticket;
    delete form.ticket;


    if (!form.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }
    var user = yield accountService.getInfoByTicket(ticket);

    var oriAddress = yield db.loadById("address", form.id, ["id", "account_id"]);
    if (!oriAddress) {
      throw errors.WHAT_NOT_EXISTS("此条地址");
    }
    if (oriAddress.account_id != user.id) {
      throw errors.WHAT_NOT_BELONGS_TO_YOU("此条地址");
    }
    form.cnee    = stringTools.htmlEncode(form.cnee);
    form.address = stringTools.htmlEncode(form.address);

    if (!form.district && form.district_id && form.district_id > 0) {
      var districtObj = yield districtService.getMyAncestor(form.district_id);

      if (districtObj) {
        form.district = districtObj.reduce(function (prev, ele) {
          return prev + " " + ele.title;
        }, "");
      }
    }
    return yield db.save("address", form, ["id"]);
  },

  delete: function *(form) {
    var ticket = form.ticket;
    delete form.ticket;
    if (!form.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    var user = yield accountService.getInfoByTicket(ticket);

    var oriAddress = yield db.loadById("address", form.id, ["id", "account_id"]);

    if (!oriAddress) {
      throw errors.WHAT_NOT_EXISTS("此条地址");
    }

    if (oriAddress.account_id != user.id) {
      throw errors.WHAT_NOT_BELONGS_TO_YOU("此条地址");
    }
    return yield db.delById("address", form.id, ["id"]);
  },

  setDefault    : function *(form) {
    var ticket = form.ticket;
    delete form.ticket;


    if (!form.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    var user = yield accountService.getInfoByTicket(ticket);

    var oriAddress = yield db.loadById("address", form.id, ["id", "account_id"]);

    if (!oriAddress) {
      throw errors.WHAT_NOT_EXISTS("此条地址");
    }

    if (oriAddress.account_id != user.id) {
      throw errors.WHAT_NOT_BELONGS_TO_YOU("此条地址");
    }

    yield db.updateBatch("address", {address_status: 1}, {
      where : "account_id=$accountId",
      params: {accountId: user.id}
    });

    return yield db.update("address", {address_status: 2, id: form.id});

  },
  getDefault    : function *(qs) {
    var ticket = qs.ticket;
    var user   = yield accountService.getInfoByTicket(ticket);
    return yield db.load("address", {
      where : "account_id=$accountId and address_status=2",
      params: {accountId: user.id},
      cols  : ["id", "district_id", "district", "address", "postcode", "cnee", "tel1", "tel2", "im", "address_status"]
    });
  },
  getAddressById: function *(qs) {
    var ticket = qs.ticket;
    var user   = yield accountService.getInfoByTicket(ticket);
    var id     = qs.id;

    if (!qs.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    return yield db.load("address", {
      where : "account_id=$accountId and id=$id",
      params: {accountId: user.id, id: id},
      cols  : ["id", "district_id", "district", "address", "postcode", "cnee", "tel1", "tel2", "im", "address_status"]
    });

  }
};