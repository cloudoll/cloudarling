var errors = require("common-rest-errors");
var share = require("./Share");
var db = require("koa-pg-naive-orm");
var config = require("../../config");
db.constr = config.postgres.conString;

var querystring = require("querystring");

module.exports = Account = {

    list: function*() {

        var qs = querystring.parse(this.request.querystring);
        var ticket = qs.ticket;

        yield  share.checkAccessList(ticket);

        var page = qs.page || 1;
        var size = qs.size || 20;

        var where = "1=1", queryParams = {};

        var qmb = qs.mobile;
        var eml = qs.email;
        var nk = qs.nick;

        if (qmb) {
            where += " and mobile like $mobile";
            queryParams.mobile = '%' + qmb + '%';
        }
        if (eml) {
            where += " and email like $email";
            queryParams.email = '%' + eml + '%';
        }
        if (nk) {
            where += " and nick like $nick";
            queryParams.nick = '%' + nk + '%';
        }


        this.body = {
            errno: 0, data: yield db.list("account", {
                where: where,
                params: queryParams,
                orderBy: "id desc",
                page: page,
                size: size,
                cols: ['id', 'mobile', 'email', 'nick', 'youku_id']
            })
        };


    }
};