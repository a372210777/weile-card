var Reflux = require('reflux')
var _ = require('underscore')
var Weile = require('../utils/weile')
var Storage = require('../utils/storage')
var Action = require('../actions/cardbag')

module.exports = Reflux.createStore({
  listenables: [Action],
  store: {
    data: [],
    cardx: {},
    ajaxState: 1   // 0请求中 1初始态  2成功 3失败
  },
  getInitialState: function() {
    if (Storage.isLogined() && !this.store.data.length) {
      this.getMemberCardList()
    }
    return this.store
  },
  getMemberCardList: function() {
    this.store.ajaxState = 0
    this.trigger(this.store)
    Weile
      .post('getMemberCardList', {
        data: {
          currentIndex: 1,
          pageCount: 100
        }
      })
      .then(function(data) {
        data = data.data.cards || []
        var cardx = {}
        _.each(data, function(el, index, list){
          _.each(el.coupons, function(e, i, l){
            if (e.state <= 2) cardx['1_' + e.couponId] = e.memberCouponId
          })
          _.each(el.cashcoupons, function(e, i, l){
            if (e.state <= 2) cardx['2_' + e.cashcouponId] = e.memberCashCouponId
          })
          _.each(el.cards, function(e, i, l){
            cardx['5_' + e.cardId] = e.merchantCardId
          })
        })
        this.store.cardx = cardx
        this.store.data = data
        this.store.ajaxState = 2
        this.trigger(this.store)
      }.bind(this))
      .fail(function() {
        this.store.ajaxState = 3
        this.trigger(this.store)
      }.bind(this))
  },
  onUpdate: function() {
    this.getMemberCardList()
  }
})