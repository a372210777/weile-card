'use strict';

var _ = require('underscore');
var envConfig = require('./env/' + (process.env.NODE_ENV || 'production')) || {};
var baseConfig = {};

module.exports = _.extend(baseConfig, envConfig);