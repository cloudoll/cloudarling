var mysql  = require('mysql');
var config = require('../config');

var pool   = mysql.createPool(config.mysql);
var errors = require('common-rest-errors');

var db = {
  query      : function (sql, params) {
    if (config.debug) {
      console.log("------------", new Date(), "----------------------------");
      console.log("sql: ", sql);
      console.log("params: ", params);
      console.log("----------------------------------------");
    }
    return function (callback) {
      pool.query(sql, params, function (err, rows, fields) {

        if (config.debug) {
          // console.log('err:', err);
          // console.log('rows:', rows);
          // console.log('fields:', fields);
        }
        if (err) {
          callback(err);
        } else {
          callback(null, rows);
        }
      });
    }
  },
  //conditions 可以支持如下： skip, limit, orderBy, where, params, cols
  list       : function *(table, conditions) {
    conditions = conditions || {};
    if (!conditions.cols) {
      conditions.cols = '*';
    }
    if (!conditions.skip) {
      conditions.skip = 0;
    }
    if (!conditions.limit) {
      conditions.limit = 5;
    }
    if (!conditions.where) {
      conditions.where = "1=1"
    }
    if (conditions.orderBy) {
      conditions.orderBy = 'order by ' + conditions.orderBy;
    } else {
      conditions.orderBy = '';
    }
    var sql  = `select ${conditions.cols} from ${table} where ${conditions.where} ${conditions.orderBy} limit ${conditions.limit} offset ${conditions.skip}`;
    var cql  = `select count(*) as ct from ${table} where ${conditions.where} `;
    var rows = yield db.query(sql, conditions.params);
    var cts  = yield db.query(cql, conditions.params);

    return {total: cts[0].ct, data: rows};

  },
  insert     : function *(table, model) {
    var sql    = `insert into \`${table}\` set ?`;
    var result = yield db.query(sql, model);
    if (result.affectedRows >= 1) {
      return {id: result.insertId};
    }
    throw errors.CUSTOM("插入失败。");
  },
  update     : function *(table, model) {
    if (!model.hasOwnProperty('id')) {
      throw errors.WHAT_REQUIRE('id');
    }
    var id  = model.id;
    var sql = `update \`${table}\` set ? where ?`;
    delete  model.id;
    var result = yield db.query(sql, [model, {id: id}]);
    if (result.changedRows) {
      return true;
    }
    throw errors.CUSTOM("不存在 id 为 " + id + " 的数据。");
  },
  updateBatch: function *(table, model, conditions) {
    if (model.hasOwnProperty('id')) {
      throw errors.CUSTOM('id 不能被修改。');
    }
    if (!conditions || !conditions.where) {
      throw errors.CUSTOM('批量修改必须有 {where: xxx, params:xxx}。');
    }
    var sql    = `update \`${table}\` set ? where ${conditions.where}`;
    var result = yield db.query(sql, [model, conditions.params]);
    if (result.changedRows) {
      return true;
    }
    throw errors.CUSTOM("更新失败，没有符合条件的数据。");
  },
  load       : function *(table, conditions) {
    conditions       = conditions || {};
    conditions.where = conditions.where || "1=1";
    conditions.limit = 1;
    conditions.cols  = conditions.cols || '*';
    var sql          = `select ${conditions.cols} from ${table} where ${conditions.where} limit ${conditions.limit}`;

    var rows = yield db.query(sql, conditions.params);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;

  },
  count      : function *(table, conditions) {
    conditions       = conditions || {};
    conditions.where = conditions.where || "1=1";
    var sql          = `select count(*) as ct from ${table} where ${conditions.where} `;
    var rows         = yield db.query(sql, conditions.params);
    if (rows.length > 0) {
      return rows[0].ct;
    }
    return 0;
  }

};


module.exports = db;
