var Reflux = require('reflux')
var _ = require('underscore')

var Action = require('../actions/tip')

module.exports = Reflux.createStore({
  listenables: [Action],
  store: {
    text: ''
  },
  timeoutId: '',
  getInitialState: function() {
    return this.store
  },
  onAlert: function(text, timer) {
    if (text) {
      timer = timer || 2500
      this.store.text = text
      this.trigger(this.store)
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(function() {
        this.store.text = ''
        this.trigger(this.store)
      }.bind(this), timer)
    }
  }
})