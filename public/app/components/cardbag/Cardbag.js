var React = require('react/addons')
var Reflux = require('reflux')
var Router = require('react-router')

var Backtop = require('../global/Backtop')
var QRCode = require('../../tools/qrcode')
var Auth = require('../mixins/Auth_view')
var Weile = require('../../utils/weile')
var Scrolltop = require('../../tools/scrollTop')
var Card = require('./Card')
var CardbagStore = require('../../stores/cardbag')

var LeshangItem = React.createClass({
  render: function(){
    return (
      <li className="leshang-wrap">
        <Router.Link to={'/leshangs/' + this.props.data.merchantId}>
          <div id={'__' + this.props.data.merchantId} className="leshang">
            {this.props.data.merchantName}
          </div>
        </Router.Link>
        {this.props.data.coupons.map(function(item, index){
          item.type = 1
          return (
            <Router.Link className="f-link-wrap" to={'/cardbag/1/' + item.memberCouponId} key={item.no}>
              <Card.Coupon data={item}/>
            </Router.Link>
          )
        })}
        {this.props.data.cashcoupons.map(function(item, index){
          item.type = 2
          return (
            <Router.Link className="f-link-wrap" to={'/cardbag/2/' + item.memberCashCouponId} key={item.no}>
              <Card.CashCoupon data={item}/>
            </Router.Link>
          )
        })}
        {this.props.data.cards.map(function(item, index){
          item.type = 5
          return ( 
            <Router.Link className="f-link-wrap" to={'/cardbag/5/' + item.merchantCardId} key={item.no}>
              <Card.Card data={item}/>
            </Router.Link>
          )
        })}
      </li>
    );
  }
});

var LeshangList = React.createClass({
  render: function(){
    return (
      <ul className="list-unstyled">
        {this.props.data.map(function(item, index){
          return <LeshangItem data={item} key={item.merchantId}/>;
        })}
      </ul>
    );
  }
});

module.exports = React.createClass({
  mixins: [Auth, Reflux.connect(CardbagStore)],
  componentDidUpdate: function(){
    var $el = window.document.getElementById('__' + this.props.query.merchantId)
    if ($el) {
      Scrolltop.to($el.offsetTop - 38)
    }
  },
  render: function(){
    var _content = false
    var leshangs = this.state.data || []
    if (leshangs.length) {
      _content = <LeshangList data={leshangs}/>
    } else if (this.state.ajaxState) {
      _content = (
        <div className="no-data-tip-wrap">
          <div>卡包中暂无卡券</div>
          <div>你可以免费领取优惠券、购买代金券，放入卡包保存和管理。
          到店消费时向商家出示卡券的二维码便可使用
          </div>
        </div>
      )
    }
    return (
      <div className="f-view-container" id="view-cardbag-cardbag">
        <div id="header-title-wrap">卡包</div>
        {_content}        
        <Backtop/>
      </div>
    );
  }
});