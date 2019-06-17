var db = require('cloudoll').orm.mysql;
var errors = require('cloudoll').errors;
var stringTools = require('common-tools').stringTools;
var accountService = require('./account');
var districtService = require('./district');
// var config          = require('../config');

module.exports = {
  list: async (ticket, publicKey) => {
    var user = await accountService.getInfoByTicket(ticket, publicKey);

    return await db.list("address", {
      where: "account_id=?",
      params: [user.id],
      cols: ["id", "district_id", "district", "address", "postcode", "cnee", "tel1", "tel2", "im", "address_status"]
    });
  },
  add: async (form, maxAddressCount, publicKey) => {

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
    form.cnee = stringTools.htmlEncode(form.cnee);
    form.address = stringTools.htmlEncode(form.address);

    var ticket = form.ticket;
    delete form.ticket;

    var user = await accountService.getInfoByTicket(ticket, publicKey);

    var cnt = await db.count("address", {
      where: "account_id=?",
      params: [user.id]
    });

    var maxAddressCount = maxAddressCount || 100;
    // if (this.app.config.address && this.app.config.address.max_count) {
    //   maxAddressCount = this.app.config.address.max_count;
    // }

    if (cnt.count >= maxAddressCount) {
      throw errors.WHAT_TOO_MUCH("您的地址");
    }


    var districtObj = await districtService.getMyAncestor(form.district_id);

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
      await db.updateBatch("address", { address_status: 1 }, {
        where: "account_id=?",
        params: [user.id]
      });
    }
    return await db.insert("address", form, ["id"]);

  },

  update: async (form) => {
    var ticket = form.ticket;
    delete form.ticket;


    if (!form.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }
    var user = await accountService.getInfoByTicket(ticket);

    var oriAddress = await db.loadById("address", form.id, ["id", "account_id"]);
    if (!oriAddress) {
      throw errors.WHAT_NOT_EXISTS("此条地址");
    }
    if (oriAddress.account_id != user.id) {
      throw errors.WHAT_NOT_BELONGS_TO_YOU("此条地址");
    }
    form.cnee = stringTools.htmlEncode(form.cnee);
    form.address = stringTools.htmlEncode(form.address);

    if (!form.district && form.district_id && form.district_id > 0) {
      var districtObj = await districtService.getMyAncestor(form.district_id);

      if (districtObj) {
        form.district = districtObj.reduce(function (prev, ele) {
          return prev + " " + ele.title;
        }, "");
      }
    }
    return await db.save("address", form, ["id"]);
  },

  delete: async (form) => {
    var ticket = form.ticket;
    delete form.ticket;
    if (!form.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    var user = await accountService.getInfoByTicket(ticket);

    var oriAddress = await db.loadById("address", form.id, ["id", "account_id"]);

    if (!oriAddress) {
      throw errors.WHAT_NOT_EXISTS("此条地址");
    }

    if (oriAddress.account_id != user.id) {
      throw errors.WHAT_NOT_BELONGS_TO_YOU("此条地址");
    }
    return await db.delById("address", form.id, ["id"]);
  },

  setDefault: async (form) => {
    var ticket = form.ticket;
    delete form.ticket;


    if (!form.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    var user = await accountService.getInfoByTicket(ticket);

    var oriAddress = await db.loadById("address", form.id, ["id", "account_id"]);

    if (!oriAddress) {
      throw errors.WHAT_NOT_EXISTS("此条地址");
    }

    if (oriAddress.account_id != user.id) {
      throw errors.WHAT_NOT_BELONGS_TO_YOU("此条地址");
    }

    await db.updateBatch("address", { address_status: 1 }, {
      where: "account_id=?",
      params: [user.id]
    });

    return await db.update("address", { address_status: 2, id: form.id });

  },
  getDefault: async (qs) => {
    var ticket = qs.ticket;
    var user = await accountService.getInfoByTicket(ticket);
    return await db.load("address", {
      where: "account_id=? and address_status=2",
      params: [user.id],
      cols: ["id", "district_id", "district", "address", "postcode", "cnee", "tel1", "tel2", "im", "address_status"]
    });
  },
  getAddressById: async (qs) => {
    var ticket = qs.ticket;
    var user = await accountService.getInfoByTicket(ticket);
    var id = qs.id;

    if (!qs.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    return await db.load("address", {
      where: "account_id=? and id=?",
      params: [user.id, id],
      cols: ["id", "district_id", "district", "address", "postcode", "cnee", "tel1", "tel2", "im", "address_status"]
    });

  }
};