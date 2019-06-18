var db = require('cloudoll').orm.mysql;
var errors = require('cloudoll').errors;
var stringTools = require('common-tools').stringTools;
var accountService = require('./account');
var districtService = require('./district');
// var config          = require('../config');

module.exports = {
  listByAccount: async (account_id) => {
    return await db.list("address", {
      where: "account_id=?",
      params: [account_id],
      cols: ["id", "district_id", "district", "address", "postcode", "cnee", "tel1", "tel2", "im", "address_status"]
    });
  },
  add: async (account_id, form, maxAddressCount, publicKey) => {
    delete form.ticket;
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

    var cnt = await db.count("address", {
      where: "account_id=?",
      params: [account_id]
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

    form.account_id = account_id;

    var addStatus = parseInt(form.address_status) || 1;
    if (addStatus > 2 || addStatus < 1) addStatus = 1;
    if (form.address_status == 2) {
      //插入默认地址需要将之前的地址置为 1
      await db.updateBatch("address", { address_status: 1 }, {
        where: "account_id=?",
        params: [account_id]
      });
    }
    return await db.insert("address", form, ["id"]);

  },

  update: async (account_id, form) => {
    delete form.ticket;
    if (!form.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    var oriAddress = await db.loadById("address", form.id, ["id", "account_id"]);
    if (!oriAddress) {
      throw errors.WHAT_NOT_EXISTS("此条地址");
    }
    if (oriAddress.account_id != account_id) {
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

  delete: async (account_id, form) => {
    delete form.ticket;
    if (!form.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    var oriAddress = await db.loadById("address", form.id, ["id", "account_id"]);

    if (!oriAddress) {
      throw errors.WHAT_NOT_EXISTS("此条地址");
    }

    if (oriAddress.account_id != account_id) {
      throw errors.WHAT_NOT_BELONGS_TO_YOU("此条地址");
    }
    return await db.delById("address", form.id, ["id"]);
  },

  setDefault: async (account_id, form) => { 
    delete form.ticket; 

    if (!form.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    var oriAddress = await db.loadById("address", form.id, ["id", "account_id"]);

    if (!oriAddress) {
      throw errors.WHAT_NOT_EXISTS("此条地址");
    }

    if (oriAddress.account_id != account_id) {
      throw errors.WHAT_NOT_BELONGS_TO_YOU("此条地址");
    }

    await db.updateBatch("address", { address_status: 1 }, {
      where: "account_id=?",
      params: [account_id]
    });

    return await db.update("address", { address_status: 2, id: form.id });

  },
  getDefault: async (account_id,qs) => {
    return await db.load("address", {
      where: "account_id=? and address_status=2",
      params: [account_id],
      cols: ["id", "district_id", "district", "address", "postcode", "cnee", "tel1", "tel2", "im", "address_status"]
    });
  },
  getAddressById: async (account_id,qs) => {
    var id = qs.id;
    if (!qs.id) {
      throw errors.WHAT_REQUIRE("地址ID【id】");
    }

    return await db.load("address", {
      where: "account_id=? and id=?",
      params: [account_id, id],
      cols: ["id", "district_id", "district", "address", "postcode", "cnee", "tel1", "tel2", "im", "address_status"]
    });

  }
};