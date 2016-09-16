var Reflux = require('reflux')
var _ = require('underscore')

var Weile = require('../utils/weile')
var Storage = require('../utils/storage')
var LeshangsAction = require('../actions/leshangs')
var CityStore = require('./city')
 
module.exports = Reflux.createStore({
  listenables: [LeshangsAction],
  store: {
    query: {
      currentIndex: '1',
      pageCount: '20',
      cityId: '',
      regionId: '',
      cateId: '',
      sortId: '6',
      lng: '',
      lat: ''
    },
    list: [],
    regions: [],
    ajaxState: 1   // 1初始态 0请求中 2成功 3失败 4最后一页
  },
  init: function() {
    this.listenTo(CityStore, this.changeCity)
  },
  getInitialState: function() {
    if (!this.store.list.length && this.store.ajaxState) {
      var location = Storage.geoLocation()
      if (location.lng && location.lat) {
        this.store.query.lng = location.lng
        this.store.query.lat = location.lat
      }
      this.store.query.cityId = Storage.cityId()
      this.store.query.regionId = ''
      this.getMerchantList()
    }
    return this.store
  },
  getMerchantList: function() {
    this.store.ajaxState = 0
    this.trigger(this.store)
    var _q = _.clone(this.store.query)
    _q.mode = _q.sortId
    _q.type = _q.cateId
    _q.sortId = ''
    _q.cateId = ''
    _q = _.pick(_q, function(value) {
      return value
    })
    Weile
      .get('getMerchantList', {
        data: JSON.stringify(_q)
      })
      .then(function(data) {
        var ls = data.data.sellerList || []
        var regions = data.data.regions || []
        if (regions.length) this.store.regions = regions
        this.store.list = this.store.list.concat(ls)
        this.store.ajaxState = ls.length < this.store.query.pageCount ? 4 : 2
        this.trigger(this.store)
      }.bind(this))
      .fail(function() {
        this.store.query.currentIndex = this.store.query.currentIndex-- || 1 
        this.store.ajaxState = 3
        this.trigger(this.store)
      }.bind(this))
  },
  changeCity: function(city) {
    this.store.query.cityId = city.id
    this.store.query.regionId = ''
    this.store.query.currentIndex = 1
    this.store.list = []
    this.getMerchantList()
  },
  onNextPage: function() {
    this.store.query.currentIndex++
    this.getMerchantList()
  },
  onUpdateFilter: function(data) {
    _.extend(this.store.query, data)
    this.store.query.currentIndex = 1
    this.store.list = []
    this.getMerchantList()
  }
})