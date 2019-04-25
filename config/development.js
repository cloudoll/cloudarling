module.exports = {
  debug: true,
  //my_host: 'localhost',
  // cloudeer: {
  //   type: 'rest', //可选 rest, tcp, zoo
  //   host: '127.0.0.1',
  //   port: 8801,
  //   username: 'youku',
  //   password: 'youku123'
  // },
  postgres: {
    host: '127.0.0.1',
    port: 5432,
    user: 'cloudbeer',
    database: "cloudark",
    password: 'zhwell',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // conString: "postgres://cloudbeer:zhwell@127.0.0.1:5432/cloudark"
  },
  // mysql   : {
  //   //mysql host 在我的 fedora 23 里面的 docker 里。
  //   connectionLimit: 10,
  //   host           : '10.211.55.15',
  //   user           : 'root',
  //   password       : 'zhwell',
  //   database       : 'cloudarling'
  // },
  address: {
    max_count: 200
  },
  account: {
    expire_in: 7200, //默认过期时间 24 小时,
    public_key: 'iloveyou', //这个是加密的key，无状态的 ticket
    dynamic_password_expire_in: 60000 //默认过期时间
  }
};
