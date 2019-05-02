const errors = require('cloudoll').errors;
const tools = require("../../tools");
const districtServie = require('../../services/district');

const District = {
  children: async ctx => {
    var qs = ctx.qs;
    var id = qs.id || 0;
    var data = await districtServie.getMyChildren(id);
    tools.responseJson(ctx, errors.success(data), qs);
  },
  family: async ctx => {
    var qs = ctx.qs;
    var id = qs.id || 0;
    var data = await districtServie.getMyFamily(id);
    tools.responseJson(ctx, errors.success(data), qs);
  },
  ancestor: async ctx => {
    var qs = ctx.qs;
    var id = qs.id || 0;
    var data = await districtServie.getMyAncestor(id);
    tools.responseJson(ctx, errors.success(data), qs);
  }
};


module.exports = District;