'use strict';

var serverPage = require('../controllers/serverPage');

module.exports = function(app) { 
  app.route('/').get(serverPage.home);

  app.route('/views/leshangs/index.html').get(serverPage.redirectLeshang);
  app.route('/detail.html').get(serverPage.redirectLeshang1);
  app.route('/views/leshangs/details.html').get(serverPage.redirectLeshang2);
};