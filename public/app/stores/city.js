var Reflux = require('reflux')
var _ = require('underscore')
var Action = require('../actions/city')
var cityData = require('../data/city.json')
var Storage =require('../utils/storage')

module.exports = Reflux.createStore({
  listenables: [Action],
  city: {},
  getInitialState: function() {
    var id = Storage.cityId()
    this.city = _.find(cityData, function(o) {
      return o.id == id
    })
    return this.city
  },
  onChangeCity: function(id) {
    Storage.cityId(id)
    this.city = _.find(cityData, function(o) {
      return o.id === id
    })
    this.trigger(this.city)
  }
})