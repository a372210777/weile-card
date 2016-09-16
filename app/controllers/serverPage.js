'use strict';

var config = require('../../config/config');
var log4 = require('../tools/log4js');
var weile = require('../server/weile');
var _ = require('underscore');
var request = require('superagent');
var city = require('../data/city.json');
var cryptoUtils = require('../tools/cryptoUtils');

exports.home = function(req, res) {
  var ips = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var ip = ips.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
  ip = ip ? ip[0] : '';
  log4.warn('用户IP: %s', ip);
  if (ip && _.max(ip.split('.')) <= 255) {
    request
      .get('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip)
      .end(function(err, response) {
        if (err) {
          log4.error(err);
        } else if (response) {
          var d = JSON.parse(response.text);
          log4.warn(d);
          if ((+d.code === 0) && d.data.city_id) {
            var t = _.find(city, function(o) {
              return o.code === d.data.city_id;
            });
            res.cookie('CITYID', t.id);
          }
        }
        res.render('index');
      });
  } else {
    res.render('index');
  }
};

/**
  重定向首页
  http://i.v89.com/views/leshangs/index.html?id=53&name=%E7%A6%8F%E5%B7%9E#/
**/
exports.redirectLeshang = function(req, res) {
  res.redirect('/');
};

/**
  重定向app分享的乐商链接
  http://ls.v89.com/detail.html?eGrQhkzL%2B0agr86MOQlKjQ%3D%3D&from=singlemessage&isappinstalled=1
**/
exports.redirectLeshang1 = function(req, res) {
  try {
    var s = _.keys(req.query)[0];
    if (s.indexOf('?') !== -1) {
      s = s.substr(0, s.indexOf('?'));
    }
    var search = cryptoUtils.aesDecrypt(s, '_ydh_search_key_');
    var ls = search ? search.split('&') : [];
    var data = {};
    for (var i = ls.length; i--;) {
      var it = ls[i];
      var index = it.indexOf('=');
      data[it.substring(0, index)] = it.substring(1 + index);
    }
    if (data.memberId) {
      res.cookie('REFERRALCODE', data.memberId);
    }
    res.redirect('/#/leshangs/' + data.id);
  } catch (e) {
    log4.error('页面重定向失败，%s', req.originalUrl);
    res.redirect('/');
  }
};
/**
  重定向后台分享的乐商链接（保存推荐人号码到cookie中）
  http://i.v89.com/views/leshangs/details.html?merchantId=11069853&channel=1
**/
exports.redirectLeshang2 = function(req, res) {
  if (+req.query.channel === 1) {
    res.cookie('REFERRALCODE', req.query.merchantId);
  }
  res.redirect('/#/leshangs/' + req.query.merchantId);
};