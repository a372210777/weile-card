'use strict';

var port = 9999;
var db = 'mongodb://127.0.0.1:27017/';
var webRootPath = 'http://117.27.146.53:' + port;
// var weiLeServicePath = 'http://preshow.v89.com:7081/WeiLe';
var weiLeServicePath = 'http://wl.v89.com:8080/WeiLe';

module.exports = {
  // 监听端口号
  port: port,
  // mongodb地址
  db: db,
  // 静态目录
  publicPath: 'public',
  // 日志级别
  logLevel: 'warn',
  // 日志目录
  logPath: '/data/logs/i.v89.com/',
  // morganFormat
  morganFormat: 'tiny',
  // 微乐服务地址
  weiLeServicePath: weiLeServicePath,
  // 支付后台回调地址
  pay_card_notify_url: weiLeServicePath + '/pay-web/card_notify_alipay_ydweb.jsp',
  // 支付成功回调页面
  pay_card_success_url: webRootPath + '/#/cardbag',
  // 支付失败回调页面
  pay_card_fail_url: webRootPath + '/#/purchase/fail'
};