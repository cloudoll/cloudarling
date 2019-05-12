const errors = require("cloudoll").errors;
const rightService = require('../../services/right');
const tools = require("../../tools");


module.exports = Right = {

  $editService: async ctx => {
    ctx.echo(await rightService.editService(ctx.request.body));
  },
  $delService: async ctx => {
    ctx.echo(await rightService.delService(ctx.request.body));
  },
  listService: async ctx => {
    var rtn = await rightService.listService(ctx.qs);
    ctx.echo(rtn);
  },
  $editRights: async ctx => {
    ctx.echo(await rightService.editRights(ctx.request.body));
  },
  listRights: async ctx => {
    var rtn = await rightService.listRights(ctx.qs);
    ctx.echo(rtn);
  },
  $delRights: async ctx => {
    ctx.echo(await rightService.delRights(ctx.request.body));
  },
  $grant: async ctx => {
    ctx.echo(await rightService.grant(ctx.request.body));

  },
  $ungrant: async ctx => {
    ctx.echo(await rightService.ungrant(ctx.request.body));

  },
  userRights: async ctx => {
    var rtn = await rightService.userRights(ctx.qs);
    ctx.echo(rtn);
  }
  // syncFromCloudeer: async ctx => {
  //   this.body = errors.success(yield rightService.syncFromCloudeer());
  // }
};