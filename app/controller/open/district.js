const districtServie = require('../../services/district');

const District = {
  children: async ctx => {
    const qs = ctx.qs;
    const id = qs.id || 0;
    const data = await districtServie.getMyChildren(id);
    ctx.echo(data);
  },
  family: async ctx => {
    const qs = ctx.qs;
    const id = qs.id || 0;
    const data = await districtServie.getMyFamily(id);
    ctx.echo(data);
  },
  ancestor: async ctx => {
    var qs = ctx.qs;
    var id = qs.id || 0;
    var data = await districtServie.getMyAncestor(id);
    ctx.echo(data);
  }
};


module.exports = District;