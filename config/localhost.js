module.exports = {
  debug   : true,
  cloudeer: {
    disabled   : false, //是否注册到 cloudeer 下
    serviceHost: "http://127.0.0.1:8801",
    myHost     : '127.0.0.1',
    // serviceHost: "http://112.74.29.211:8801",
    // myHost     : '10.163.56.11',
    myName     : 'cloudarling'
  },
  mysql   : {
    //mysql host 在我的 fedora 23 里面的 docker 里。
    connectionLimit: 10,
    host           : '10.211.55.15',
    user           : 'root',
    password       : 'zhwell',
    database       : 'cloudarling'
  },
  account : {
    expire_in                 : 7200, //默认过期时间 24 小时,
    public_key                : 'iloveyou', //这个是加密的key，无状态的 ticket
    dynamic_password_expire_in: 60000 //短信默认过期时间
  }
};



