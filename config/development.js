module.exports = {
  port                 : 7301,
  app_name             : 'cloudarling',
  debug                : true,
  //my_host: 'localhost',
  cloudeer             : {
    disabled: false, //是否注册到 cloudeer 下
    server  : "http://127.0.0.1:8801",
    // myHost     : '127.0.0.1',
    //serviceHost: "http://112.74.29.211:8801",
    // myHost  : '10.163.56.91',
    // myName  : 'cloudarling'
  },
  address              : {
    max_count: 200
  },
  koa_middles_forbidden: {
    json_validator: true,
    authenticate  : true
  },
  postgres             : {
    //conString: "postgres://postgres:docker_youku@112.74.29.211:5432/xietest"
    conString: "postgres://cloudbeer:zhwell@127.0.0.1:5432/u-cloudarling"
  },
  // mysql   : {
  //   //mysql host 在我的 fedora 23 里面的 docker 里。
  //   connectionLimit: 10,
  //   host           : '10.211.55.15',
  //   user           : 'root',
  //   password       : 'zhwell',
  //   database       : 'cloudarling'
  // },
  account              : {
    expire_in                 : 7200, //默认过期时间 24 小时,
    public_key                : 'iloveyou', //这个是加密的key，无状态的 ticket
    dynamic_password_expire_in: 60000 //短信默认过期时间
  }
};
//
// ticket=eyJvcGVuX2lkIjoiNTljNDViNzhhZDE1NGYzMmI3NGNhMDUyMzlhY2M5Y2EiLCJleHBpcmVzX2luIjoxNDY1ODk3Mzk2LCJzaWduIjoiNTk3MDQ2ZjliOWI0U3YjZiOTQxNmE5Y2I3ZjFhMGExMTY2MTEzNGQ0Y2Y5NmEzZTgyOTRiOGJjNGQ2NiJ9
// ticket=eyJvcGVuX2lkIjoiNTljNDViNzhhZDE1NGYzMmI3NGNhMDUyMzlhY2M5Y2EiLCJleHBpcmVzX2luIjoxNDY1ODk3Mzk2LCJzaoiNTk3MDQ2ZjliOWI0ZWUzNzU3YjZiOTQxNmE5Y2I3ZjFhMGExMTY2MTEzNGQ0Y2Y5NmEzZTgyOTRiOGJjNGQ2NiJ9&service=cloudarling

