const errors = require("cloudoll").errors;
const tools = require("../../tools");
const addressService = require('../../services2/address');

const Address = {
  $add: async ctx => {
    ctx.body = errors.success(
      await addressService.add(ctx.request.body, ctx.app.config.address.max_count)
    );
  },
  $update: async ctx => {
    ctx.body = errors.success(await addressService.update(ctx.request.body));
  },
  $delete: async ctx => {
    ctx.body = errors.success(await addressService.delete(ctx.request.body));
  },
  $setDefault: async ctx => {
    ctx.body = errors.success(await addressService.setDefault(ctx.request.body));
  },
  list: async ctx => {
    var rtn = await addressService.list(ctx.qs.ticket);
    tools.responseJson(this, { errno: 0, data: rtn }, ctx.qs);
  },
  default: async ctx => {
    var rtn = await addressService.getDefault(ctx.qs);
    tools.responseJson(this, { errno: 0, data: rtn }, ctx.qs);
  },
  one: async ctx => {
    var rtn = await addressService.getAddressById(ctx.qs);
    tools.responseJson(this, { errno: 0, data: rtn }, ctx.qs);
  }
};

module.exports = Address;