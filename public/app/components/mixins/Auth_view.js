var Storage = require('../../utils/storage')
var Auth = require('../user/Auth')

module.exports = {
  statics: {
    willTransitionTo: function(transition) {
    	console.log('页面级权限验证')
      if (!Storage.isLogined()) {
        Auth.goBackPath = transition.path
        transition.redirect('/auth') 
      }
    }
  }
};