var Reflux = require('reflux')

var Storage = require('../utils/storage')
var Action = require('../actions/user')

module.exports = Reflux.createStore({
  listenables: [Action],
  user: {
    isLogined: false
  },
  init: function() {
    this.user.isLogined = Storage.isLogined()
  },
  onSignIn: function() {
    this.user.isLogined = true
    this.trigger(this.user)
  },
  onSignOut: function() {
    this.user.isLogined =false
    this.trigger(this.user) 
  }
})