'use strict';

var _ = require('underscore');
var cryptoUtils = require('../tools/cryptoUtils');
var config = require('../../config/config');
var log4 = require('../tools/log4js');
var weile = require('../server/weile');
var cityData = require('../data/city.json');
var regionData = require('../data/region.json');

exports.getMerchantList = function(req, res) {
  var _data = JSON.parse(req.query.data);
  weile
    .requestWeiLeAPI({
      url: 'getMerchantList',
      encryptType: '1',
      data: _data,
      session: 'eyJ0b2tlbiI6ImJjNmI0OWM2YjY0YzRhNDZhYWUyNzk0ZWQ4M2Q3YTk1IiwidHlwZSI6InRydWUifQ==',
      key: 'bc6b49c6b64c4a46'
    })
    .then(function(data) {
      var cityId = '' + (_data.cityId || '');
      if (+_data.currentIndex === 1 && cityId) {
        var city = _.find(cityData, function(item){
          return item.id === cityId;
        });
        var reg = new RegExp('^' + city.code.substr(0, 4) + '[0-9]{2}$');
        var regions = _.filter(regionData, function(item) {
          return reg.test(item.code);
        });
        regions.unshift({
          id: '',
          name: city.name,
          code: city.code
        });
        data.data.regions = regions;
      }
      res.send(data);
    })
    .fail(function(o) {
      weile.weiLeException(req, res, o);
    });
};

exports.getCardList = function(req, res) {
  var _data = JSON.parse(req.query.data);
  weile
    .requestWeiLeAPI({
      url: 'getCardList',
      encryptType: '1',
      data: _data,
      session: 'eyJ0b2tlbiI6ImJjNmI0OWM2YjY0YzRhNDZhYWUyNzk0ZWQ4M2Q3YTk1IiwidHlwZSI6InRydWUifQ==',
      key: 'bc6b49c6b64c4a46'
    })
    .then(function(data) {
      var cityId = '' + (_data.cityId || '');
      if (+_data.currentIndex === 1 && cityId) {
        var city = _.find(cityData, function(item){
          return item.id === cityId;
        });
        var reg = new RegExp('^' + city.code.substr(0, 4) + '[0-9]{2}$');
        var regions = _.filter(regionData, function(item) {
          return reg.test(item.code);
        });
        regions.unshift({
          id: '',
          name: city.name,
          code: city.code
        });
        data.data.regions = regions;
      }
      res.send(data);
    })
    .fail(function(o) {
      weile.weiLeException(req, res, o);
    });
};

exports.tourist = function(req, res) {
  weile
    .requestWeiLeAPI({
      url: req.params.act,
      encryptType: req.query.encryptType,
      data: JSON.parse(req.query.data),
      session: 'eyJ0b2tlbiI6ImJjNmI0OWM2YjY0YzRhNDZhYWUyNzk0ZWQ4M2Q3YTk1IiwidHlwZSI6InRydWUifQ==',
      key: 'bc6b49c6b64c4a46'
    })
    .then(function(data) {
      res.send(data);
    })
    .fail(function(o) {
      weile.weiLeException(req, res, o);
    });
};

exports.register = function(req, res) {
  var _data = req.body.data || {};
  _data.password = '' + _.random(100000, 999999);
  weile
    .requestWeiLeAPI({
      url: 'register',
      encryptType: 2,
      data: {
        recommendTelephone: req.cookies.REFERRALCODE || '',
        uuid: _data.uuid,
        identifyingCode: _data.identifyingCode,
        password: _data.password,
        ifSendSms: 1
      }
    })
    .then(function(data) {
      return weile.requestWeiLeAPI({
        url: 'login2',
        encryptType: 2,
        data: {
          uuid: _data.uuid,
          password: cryptoUtils.md5(_data.password)
        }
      });
    })
    .then(function(data) {
      if (data.resultCode === 0) {
        var session = data.data.session;
        var key = data.data.key;
        log4.info('登录微乐（%s | %s）', session, key);
        req.session.WEILESESSION = session;
        req.session.WEILEKEY = key;
        res.send({
          data: {},
          resultCode: 0,
          msg: '登录成功'
        });
      } else {
        res.send(data);
      }
    })
    .fail(function(o) {
      weile.weiLeException(req, res, o);
    });

};

exports.login = function(req, res) {
  weile
    .requestWeiLeAPI({
      url: 'login2',
      encryptType: 2,
      data: req.body.data
    })
    .then(function(data) {
      if (data.resultCode === 0) {
        var session = data.data.session;
        var key = data.data.key;
        log4.info('登录微乐（%s | %s）', session, key);
        req.session.WEILESESSION = session;
        req.session.WEILEKEY = key;
        res.send({
          data: {},
          resultCode: 0,
          msg: '登录成功'
        });
      } else {
        res.send(data);
      }
    })
    .fail(function(o) {
      weile.weiLeException(req, res, o);
    });
};

exports.member = function(req, res) {
  weile
    .requestWeiLeAPI({
      url: req.params.act,
      encryptType: req.body.encryptType,
      data: req.body.data,
      session: req.session.WEILESESSION,
      key: req.session.WEILEKEY
    }, req)
    .then(function(data) {
      res.send(data);
    })
    .fail(function(o) {
      weile.weiLeException(req, res, o);
    });
};

exports.getMemberCardList = function(req, res) {
  weile
    .requestWeiLeAPI({
      url: 'getMemberCardList',
      encryptType: 1,
      data: {
        currentIndex: 1,
        pageCount: 100
      },
      session: req.session.WEILESESSION,
      key: req.session.WEILEKEY
    })
    .then(function(data) {
      // reconsitution api
      var ls = data.data.cards || [];
      var tls = [];
      for (var i = ls.length; i--;) {
        var t = ls[i];
        if (t.coupons === '[]') t.coupons = [];
        if (t.cashcoupons === '[]') t.cashcoupons = [];
        if (t.ncards === '[]') t.ncards = [];
        if (t.coupons.length || t.cashcoupons.length || t.ncards.length) {
          tls.push({
            merchantType: t.merchantType,
            merchantId: t.merchantId,
            merchantName: t.merchantName,
            distance: t.distance,
            coupons: t.coupons,
            cashcoupons: t.cashcoupons,
            cards: t.ncards
          });
        }
      }
      data.data.cards = tls;
      // end reconsitution api
      res.send(data);
    })
    .fail(function(o) {
      weile.weiLeException(req, res, o);
    });
};

exports.pay = function(req, res) {
  var _session = req.session.WEILESESSION || '';
  var _key = req.session.WEILEKEY || '';
  var _data = req.body.data;
  weile
    .requestWeiLeAPI({
      url: 'makeMerchantCardOrder',
      encryptType: 1,
      data: {
        buyMerchantId: _data.buyMerchantId || 0, // 所在门店乐商id
        sourceId: _data.sourceId, // 与source字段对应（1：代金券id，2：储值卡id，3：用户储值卡id）
        source: _data.source, // （1：代金卷购买，2：储值卡购买，3：储值卡充值 4：会员卡购买，5：会员卡充值）
        quantity: _data.quantity // 购买数量
      },
      session: _session,
      key: _key
    })
    .then(function(o) {
      return weile.requestWeiLeAPI({
        url: 'payMerchantCardOrder',
        encryptType: 1,
        data: {
          orderId: o.data.orderId, // 订单号
          isEnableSyspay: 0, // 是否使用乐币支付
          outerpayType: _data.outerpayType // 外部支付类型（2：支付宝，5：微信）
        },
        session: _session,
        key: _key
      });
    })
    .then(function(o) {
      return weile.requestWeiLeAPI({
        url: 'requestAlipayUrl',
        encryptType: 1,
        data: {
          out_trade_no: o.data.outerpayId, // 订单号
          subject: _data.subject, // 订单名称
          total_fee: o.data.amount / 1000, // 付款金额（元）
          notify_url: config.pay_card_notify_url, // 支付回调地址
          call_back_url: config.pay_card_success_url + '?merchantId=' + _data.buyMerchantId, // 支付成功跳转页面
          merchant_url: config.pay_card_fail_url // 支付失败跳转页面
        },
        session: _session,
        key: _key
      });
    })
    .then(function(o) {
      res.send(o);
    })
    .fail(function(o) {
      weile.weiLeException(req, res, o);
    });
};