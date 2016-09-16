var React = require('react/addons')
var Router = require('react-router')
var _ = require('underscore')

var Auth = require('../mixins/Auth_view')
var Weile = require('../../utils/weile')
var Card = require('./Card')
var CardbagAction = require('../../actions/cardbag')

var View = React.createClass({
  mixins: [Router.Navigation],
  handleUseCoupon: function(e) {
    Weile
      .post('useMerchantCoupon', {
        data: {
          couponMemberId: this.props.data.memberCouponId,
          useMerchantId: this.props.data.merchantId
        }
      })
      .then(function(){
        this.goBack() || this.replaceWith('/cardbag')
      }.bind(this))
      .fail(function(){})
  },
  render: function(){
    var _state = false
    var data = this.props.data || {}
    console.log(data)
    var rule = data.rule.replace(/\n/g, '<br>')
    return (
      <div className="f-view-container" id="view-my-coupon">
        <Card.Coupon data={data} isOpen={+data.state < 2}/>
        <section className="info-section use-tip">
          使用方法：向商家出示上方的二维码
        </section>
        <section className="info-section">
          <div className="title">使用说明</div>
          <div className="content" dangerouslySetInnerHTML={{__html: rule}}/> 
        </section>
        <section className="info-section">
          <div className="title">适用门店</div>
          <ul className="list-unstyled content store-wrap">
          {data.stores.map(function(item, index){
            return (
              <li key={index}>
                <Router.Link to={'/leshangs/' + item.storeId}>
                  <div className="name">{item.name}</div>
                </Router.Link>
                <div className="address">{item.address}</div>
                <a className="phone" href={'tel:' + item.phone}><i className="fontello-icon">&#xe80c;</i></a>
              </li> 
            )
          })}
          </ul>
        </section>      
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [Router.Navigation, Auth],
  getInitialState: function() {
    this.getCoupon()
    return {
      data: null
    }
  },
  shouldComponentUpdate: function(nextProps, nextState){
    var data = this.state.data
    if (data && data.state != nextState.data.state) {
      CardbagAction.update()
    }
    return true
  },
  getCoupon: function(){
    Weile
      .post('getMemberCoupon', {
        data: {
          memberCouponId: this.props.params.cardId
        }
      })
      .then(function(data){
        var d = {}
        _.extend(d, data.data.coupons)
        _.extend(d, data.data.memberCoupons)
        d.stores = data.data.stores
        d.cardName = d.name
        d.type = '1'
        this.setState({data: d})
      }.bind(this))
      .fail(function(){})
  },
  handleGoback: function(e){
    e.preventDefault()
    this.goBack() || this.replaceWith('/cardbag')
  },
  handleRefresh: function(e){
    this.getCoupon()
  },
  render: function(){
    var _V = false
    if (this.state.data) {
      _V = <View data={this.state.data}/>
    }
    return (
      <div>
        <div id="second-header">
          <header>
            <div className="pull-left goback-btn" onClick={this.handleGoback}>
              <i className="go-back-icon"></i>
            </div>
            <span className="title f16">我的优惠券</span>
            <div id="header-right-btn-wrap" onClick={this.handleRefresh}><i className="fontello-icon">&#xe813;</i></div>
          </header>
        </div>
        {_V} 
      </div>
    )
  }
})