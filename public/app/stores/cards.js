var Reflux = require('reflux')
var _ = require('underscore')

var Weile = require('../utils/weile')
var Storage = require('../utils/storage')
var CardsAction = require('../actions/cards')
var CityStore = require('./city')

module.exports = Reflux.createStore({
  listenables: [CardsAction],
  store: {
    query: {
      currentIndex: '1',
      pageCount: '20',
      cardType: '1,2,5',
      cityId: '',
      regionId: '',
      cateId: '',
      sortId: '',
      lng: '',
      lat: '',
      distance: '99999000'
    },
    list: [],
    regions: [],
    ajaxState: 1   // 0请求中 1初始态  2成功 3失败 4最后一页
  },
  init: function() {
    this.listenTo(CityStore, this.changeCity)
  },
  getInitialState: function() {
    if (!this.store.list.length && this.store.status != 1) {
      var location = Storage.geoLocation()
      if (location.lng && location.lat) {
        this.store.query.lng = location.lng
        this.store.query.lat = location.lat
      }
      this.store.query.cityId = Storage.cityId()
      this.store.query.regionId = ''
      this.getCardList()
    }
    return this.store
  },
  getCardList: function() {
    this.store.ajaxState = 0
    this.trigger(this.store)
    var _q = _.clone(this.store.query)
    _q.sortType = _q.sortId
    _q.categoryType = _q.cateId
    _q.sortId = ''
    _q.cateId = ''
    var _q = _.pick(_q, function(value) {
      return value
    })
    Weile
      .get('getCardList', {
        data: JSON.stringify(_q)
      })
      .then(function(data) {
        var ls = data.data.merchantList || []
        var regions = data.data.regions || []
        if (regions.length) this.store.regions = regions
        this.store.list = this.store.list.concat(ls)
        this.store.ajaxState = ls.length < this.store.query.pageCount ? 4 : 2
        this.trigger(this.store)
      }.bind(this))
      .fail(function() {
        this.store.ajaxState = 3
        this.trigger(this.store)
      }.bind(this))
  },
  changeCity: function(city) {
    this.store.query.cityId = city.id
    this.store.query.regionId = ''
    this.store.query.currentIndex = 1
    this.store.list = []
    this.getCardList()
  },
  onNextPage: function() {
    this.store.query.currentIndex++
    this.getCardList()
  },
  onUpdateStatus: function(status) {
    this.list = []
    this.setStatus(status || 2)
  },
  onUpdateFilter: function(data) {
    _.extend(this.store.query, data)
    this.store.query.currentIndex = 1
    this.store.list = []
    this.getCardList()
  }
});