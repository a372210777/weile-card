var Router = require('react-router')
var Storage = require('../../utils/storage')
var Auth = require('../user/Auth')


module.exports = {
	mixins: [Router.Navigation],
	isLogined: function() {
		console.log('函数级权限验证')
		if (!Storage.isLogined()) {
			this.transitionTo('/auth')
			return false
		} else {
			return true			
		}
	}
}