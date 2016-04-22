var yaccount = require("../../yservice/YAccount");
var errors = require("common-rest-errors");

module.exports = Share = {

    checkAccessList: function *(ticket) {

        var rInfo = yield yaccount.getRightsByTicket(ticket, "passport");

        var exists = rInfo.rights.filter(function (ele) {
            return ele.code == "ADMIN" || ele.code == "list";
        });
        if (exists.length <= 0)
            throw errors.NO_RIGHTS;
        return rInfo;
    },

    checkAccessEdit: function *(ticket) {

        var rInfo = yield yaccount.getRightsByTicket(ticket, "passport");

        var exists = rInfo.rights.filter(function (ele) {
            return ele.code == "ADMIN" || ele.code == "edit";
        });
        if (exists.length <= 0)
            throw errors.NO_RIGHTS;
        return rInfo;
    },

    checkAccessAdmin: function *(ticket) {

        var rInfo = yield yaccount.getRightsByTicket(ticket, "passport");

        var exists = rInfo.rights.filter(function (ele) {
            return ele.code == "ADMIN" || ele.code == "admin";
        });
        if (exists.length <= 0)
            throw errors.NO_RIGHTS;
        return rInfo;
    }

};