var db = require('cloudoll').orm.mysql;

var District = module.exports = {

  dists            : null,
  getAllFromDB     : async () => {
    //District.dists = (yield db.take("district", {cols: ["id", "title", "parent_id"], size: -1}));
    // console.log("BBBBBBB");
    District.dists  = await db.list("area", {cols: ["id", "title", "short_name", "parent_id", "lat", "lng", "sort", "level"], limit: 50000});
  },
  getMyChildren    : async id=> {
    if (District.dists == null)
      await District.getAllFromDB();

    id = id || 0;
    id = parseInt(id);
    return District.dists.filter(function (ele) {
      return ele.parent_id == id;
    });
  },
  getMyFamily      : async (id) => {
    if (District.dists == null)
      await District.getAllFromDB();

    id            = id || 0;
    id            = parseInt(id);
    var container = [];

    District.recursiveMyFamily(id, container, District.dists, false);

    var rtn = container.reverse();

    //return rtn;
    // 同时获取自己的儿子
    var mySons = District.dists.filter(function (ele) {
      return ele.parent_id == id;
    });

    rtn.push(mySons);
    return rtn;
  },
  getMyAncestor    : async (id) => {
    if (District.dists == null)
      await District.getAllFromDB();

    id            = id || 0;
    id            = parseInt(id);
    var container = [];

    District.recursiveMyFamily(id, container, District.dists, true);


    return container.reverse();
  },
  recursiveMyFamily: function (id, container, dists, noBrother) {

    if (id > 0) {
      var mes = dists.filter(function (ele) {
        return ele.id == id;
      });

      if (mes.length == 1) {

        var me = mes[0];

        if (noBrother) {
          container.push(me);
        }
        else {

          var myBros = dists.filter(function (ele) {
            //ele.selected = false;
            return ele.parent_id == me.parent_id;
          });
          myBros.forEach(function (ele) {
            ele.selected = false;
          });
          container.push(myBros);
        }
        me.selected = true;


        District.recursiveMyFamily(me.parent_id, container, dists, noBrother);
      }
    }
  }
};