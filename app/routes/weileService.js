'use strict';

var weileService = require('../controllers/weileService');

module.exports = function(app) {
  app.route('/weileService/getMerchantList').get(weileService.getMerchantList);
  app.route('/weileService/getCardList').get(weileService.getCardList);
  app.route('/weileService/:act').get(weileService.tourist);
  
  app.route('/weileService/register').post(weileService.register);
  app.route('/weileService/login').post(weileService.login);
  app.route('/weileService/getMemberCardList').post(weileService.getMemberCardList);
  app.route('/weileService/pay').post(weileService.pay);
  app.route('/weileService/:act').post(weileService.member);
}; 