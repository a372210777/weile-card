var React = require('react/addons')
var Router = require('react-router')
//修改部分
var Reflux = require('reflux')
var CardbagStore = require('../../stores/cardbag')
var _ = require('underscore')
var Storage = require('../../utils/storage')

var Weile = require('../../utils/weile')
var Auth = require('../mixins/Auth_func')
var CardbagAction= require('../../actions/cardbag')

var View = React.createClass({
  //mixins: [Auth],
  mixins: [Auth, Reflux.connect(CardbagStore)],
  handleClick: function(e){
    e.preventDefault()
    if (this.isLogined()) {
      if (this.props.myCardId) {
        this.transitionTo('/cardbag/1/' + this.props.myCardId) 
      } else {
        Weile
          .post('receiveMerchantCoupon', {
            data: {
              couponId: this.props.data.couponId,
              receiveMerchantId: this.props.data.merchantId
            }
          })
          .then(function(data) {
            CardbagAction.update()
            this.transitionTo('/cardbag?merchantId=' + this.props.data.merchantId)
          }.bind(this))
          .fail(function(data) {
          }.bind(this))
      }
    }
  },

  render: function(){
    var _leftside = false
    var card = this.props.data || {}
    var desc = card.description.replace('\n', '<br>')
    var rule = card.rule.replace(/\n/g, '<br>')
    var classes = 'coupon coupon-' + card.preferentialType
    if (card.preferentialType == '0' || card.preferentialType == '1') {
      _leftside = (
        <div className="left-side">
          <span className="f16">¥</span>{card.cardValue/1000} 
        </div>
      )
    } else if (card.preferentialType == '3' || card.preferentialType == '4') {
      _leftside = (
        <div className="left-side">
          {card.discount || '8.8'}<span className="f16">折</span>
        </div>
      )
    }       
    return (

      <div className="f-view-container" id="view-card-coupon">

        <div className={classes}>
          <div className="content">
            {_leftside}
            <div className="right-side">
              <div className="name">{card.name}</div>
            </div>
          </div>
          <div className="logo" style={{backgroundImage: 'url(' + card.logoUrl + ')'}}></div>
          <footer className="footer">
            已领取{card.receiveCount}人
          </footer>
        </div>
        <section className="info-section">
          <div className="title">领用说明</div>
          <div className="content" dangerouslySetInnerHTML={{__html: desc}}/>
        </section>
        <section className="info-section">
          <div className="title">使用说明</div>
          <div className="content" dangerouslySetInnerHTML={{__html: rule}}/> 
        </section>
        <section className="info-section">
          <div className="title">适用门店</div>
          <ul className="list-unstyled content store-wrap">
          {card.stores.map(function(item, index){
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
        <div className="handle-button-wrap">
          <button onClick={this.handleClick}>{this.props.myCardId ? '立即使用' : '立即领取'}</button>
        </div>   
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    this.getCoupon()
    return {
      data: null
    }
  },
  getCoupon: function(){
    Weile
      .get('getCoupon', {
        data: JSON.stringify({
          couponId: this.props.params.cardId
        })
      })
      .then(function(data){
        this.setState({data: data.data})
      }.bind(this))
      .fail(function(){})
  },
  handleGoback: function(e){
    e.preventDefault()
    this.goBack() || this.replaceWith('/')
  },
  render: function(){
    var data = this.state.data
    var _V = false
    var cardName = '优惠券'
    if (data) { 
      _V = <View data={data} myCardId={this.props.query.myCardId}/>
      cardName = data.preferentialName || '优惠券'
    }
    return (
      <div>
        <div id="second-header">
          <header className={'coupon coupon-' + this.props.query.type}>
            <div className="pull-left goback-btn" onClick={this.handleGoback}>
              <i className="go-back-icon"></i>
            </div>
            <span className="title f16">{cardName}</span>
          </header>
        </div>
        {_V}
      </div>
    );
  }
});