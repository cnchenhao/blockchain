'use strict';

module.exports = appInfo => {

  exports.onerror = {
    errorPageUrl: (err, ctx) => ctx.errorPageUrl || '/500',
    all: (err, ctx) => {
      this.logger.err(err);
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      ctx.body = "server error";
      ctx.status = 500;
    },
    html: (err, ctx) => {
      this.logger.err(err);
      // html hander
      ctx.body = "server error";
      ctx.status = 500;
    },
    json: (err, ctx) => {
      this.logger.err(err);
      // json hander
      ctx.body = { message: "server error" };
      ctx.status = 500;
    },
    jsonp: (err, ctx) => {
      this.logger.err(err);
      // 一般来说，不需要特殊针对 jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
    },
  };

  // 请修改日志路径
  exports.logger = {
    dir: appInfo.root + '/logs/' + appInfo.name,
  };

  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1534734165995_8881';

  // 请修改jwt密钥和失效时间
  config.login = {
    secretKey: 'HO88B58fgfsv1UafNOoYuyKZ9cjjDKOa', // jwt密钥
    expires: 60 * 60 * 24, // 超时时间24小时
  };

  // ONT链相关配置
  config.ont = {
    isMain: false,
    mainRestUrl: 'http://dappnode1.ont.io:20334',
    testRestUrl: 'http://polaris1.ont.io:20334',
    gasLimit: '20000',
    gasPrice: '500',

    // 钱包地址和私钥
    adminAddress: "AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz",
    adminPrivateKey: "7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b97"
  };

  // //KYC认证相关配置
  // config.kyc = {
  //   authRecordRestUrl: 'https://app.ont.io/S1/api/v1/ontpass/candybox/authentication/record',
  // };

  //任务相关配置
  config.mission = {
    kyc_authRecordRestUrl: 'https://app.ont.io/S1/api/v1/ontpass/candybox/authentication/record',      //KYC认证判定地址
    holdOnt_queryQualificationUrl: 'https://app.ont.io/S3/api/v1/onto/candybox/balance/qualification', //账号资格判断地址
    kyc_ontPassOntId: 'did:ont:AUiPt6NWppcrRMFLA9QPUV2BHEwfeAwPUt',  //正式：did:ont:AJiNGQAZSgLV4tLBPzQaVifsGqwapvexE6
  };

  // add your config here
  config.middleware = [];

  // 配置端口号，主机名
  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '',
      https: true,
    },
  };

  // 请修改数据库配置
  config.sequelize = {
    dialect: 'mysql',
    hostname: '192.168.18.22',
    host: '192.168.18.22',
    port: 3306,
    database: 'candybox',
    //user: 'root',
    // 密码
    //password: 'ySeaQhxOBh7k',
    dialectOptions: {
      multipleStatements: true,
    },
  };

  config.assetSlices = {
    // 请修改服务器域名
    hostDomain: 'http://47.100.77.82:7001',
  };

  // 请修改telegram配置
  config.telegram = {
    start_url: 'https://telegram.me/haoge_bot?start=',
    sendMessage_url: 'https://api.telegram.org/bot633068050:AAFwsK25cLXxLRue0Jv4luaL_c48A2nt25g/sendMessage',
    sendMessage_params: { chat_id: 0, text: '' },
    botName: 'haoge_bot',
    botToken: '633068050:AAFwsK25cLXxLRue0Jv4luaL_c48A2nt25g',
    host_url: 'https://t.me/',
  };


  return config;

};