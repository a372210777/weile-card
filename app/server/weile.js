'use strict';

var config = require('../../config/config');
var log4 = require('../tools/log4js');
var cryptoUtils = require('../tools/cryptoUtils');
var request = require('superagent');
var Q = require('q');
var _ = require('underscore');

function encryptData(encryptType, data, session, key) {
  var result = {};
  var _d = {
    encryptType: encryptType || 1,
    data: data,
  };
  switch (+_d.encryptType) {
    case 0:
      result.request = JSON.stringify(_d);
      break;
    case 1:
      _d.session = session;
      _d.data = cryptoUtils.aesEncrypt(JSON.stringify(_d.data), key);
      result.request = JSON.stringify(_d);
      break;
    case 2:
      result.sign = cryptoUtils.md5(JSON.stringify(_d));
      result.request = JSON.stringify(_d);
      break;
    default:
  }
  return result;
}

function decryptData(data, key) {
  var o = data || {};
  if (+o.encryptCode === 1 && o.data) {
    try {
      data = cryptoUtils.aesDecrypt(o.data, key);
    } catch (e) {
      o.errorMsg = '解密异常！';
      return o;
    }
    try {
      o.data = JSON.parse(data);
    } catch (e) {
      o.errorMsg = 'JSON 解析异常！';
      return o;
    }
  }
  return o;
}

function getHeaders(req) {
  req = req || {};
  var result = {
    weileversion: '290',
    clientos: '104',
    Referer:'http://i.v89.com',
    lng: '89.9999',
    lat: '0.0001'
  };
  var headers = _.pick(req.headers || {}, ['cityid', 'lng', 'lat']);
  _.each(headers, function(value, key, list) {
    if (!value) {
      delete list[key];
    }
  });
  result = _.extend(result, headers);
  log4.info(result);
  return result;
}

exports.requestWeiLeAPI = function(options, req) {
  var deferred = Q.defer();
  var url = config.weiLeServicePath + '/WeiLeService?act=' + options.url;
  var encryptType = options.encryptType || 1;
  var data = options.data || {};
  var session = options.session || 'eyJzZXNzaW9uS2V5IjoiMTMwNTU1Mjk2NzUiLCJ0b2tlbiI6ImZzMTE1ODQzZl8yMTYyMzAwOSJ9';
  var key = options.key || '1111111111111111';
  var fdata = encryptData(encryptType, data, session, key);
  log4.info(options);
  log4.info(fdata);
  request
    .post(url)
    .type('form')
    .send(fdata)
    .set(getHeaders(req))
    .end(function(error, response) {
      if (error) {
        log4.error(error);
        deferred.reject(new Error(error));
      } else {
        var data = decryptData(response.body, key);
        log4.info(response.body);
        log4.info(data.data);
        if (+data.resultCode !== 0) {
          deferred.reject(data);
        } else {
          deferred.resolve(data);
        }
      }
    });
  return deferred.promise;
};

exports.weiLeException = function(req, res, data) {
  if (data instanceof Error) {
    log4.error(data);
    data = {
      data: {},
      resultCode: 9999,
      msg: '系统错误'
    };
  } else {
    switch (data.resultCode) {
      case 8000:
      case 9000:
        log4.info('登录成功后跳转地址：%s', req.headers.referer);
        req.session.LOGINTARGETPATH = req.headers.referer;
        break;
      default:
    }
  }
  res.send(data);
};