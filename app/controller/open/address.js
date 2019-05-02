const errors = require("cloudoll").errors;
const tools = require("../../tools");
const addressService = require('../../services/address');

const Address = {
  $add: async ctx => {
    const res = await addressService.add(ctx.request.body, ctx.app.config.address.max_count);
    ctx.echo(res);
  },
  $update: async ctx => {
    ctx.echo(await addressService.update(ctx.request.body));
  },
  $delete: async ctx => {
    ctx.echo(await addressService.delete(ctx.request.body));
  },
  $setDefault: async ctx => {
    ctx.echo(await addressService.setDefault(ctx.request.body));
  },
  list: async ctx => {
    const rtn = await addressService.list(ctx.qs.ticket);
    ctx.echo(rtn);
  },
  default: async ctx => {
    const rtn = await addressService.getDefault(ctx.qs);
    ctx.echo(rtn);
  },
  one: async ctx => {
    const rtn = await addressService.getAddressById(ctx.qs);
    ctx.echo(rtn);
  }
};

module.exports = Address;