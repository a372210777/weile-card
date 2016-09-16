var React = require('react/addons')
var Router = require('react-router')

var Weile = require('../../utils/weile')
var Auth = require('../mixins/Auth_view')
var TipAction = require('../../actions/tip')

var View = React.createClass({
  getInitialState: function(){
    var card = this.props.data || {}
    return {
      isWechat: /micromessenger/.test(window.navigator.userAgent.toLowerCase()),
      unitPrice: card.price,
      amount: card.stockCount ? 1 : 0,
      stock: card.stockCount || 0,
      ajaxState: 1   // 1初始态 0请求中 2成功 3失败
    }
  },
  setAmount: function(v) {
    if (v < 1) v = 1
    if (v > this.state.stock) v = this.state.stock
    this.setState({amount: v})
  },
  handleChangeAmount: function(e){
    this.setAmount(+e.target.value.trim())
  },
  handleAddAmount: function() {
    this.setAmount(this.state.amount + 1)
  },
  handleSubAmount: function() {
    this.setAmount(this.state.amount - 1)
  },
  handleSubmit: function(e) {
    e.preventDefault()
    if (this.state.ajaxState) {
      this.setState({ajaxState: 0})
      Weile
        .post('pay', {
          data: {
            buyMerchantId: this.props.data.merchantId,
            sourceId: this.props.data.cardId,
            source: 4,
            quantity: this.state.amount,
            outerpayType: 2,
            subject: this.props.data.name
          }
        })
        .then(function(data){
          this.setState({ajaxState: 2})
          location.href = data.data.url
        }.bind(this))
        .fail(function(){
          this.setState({ajaxState: 3})
        }.bind(this))
    }
  },
  render: function(){
    var card = this.props.data || {}
    var amount = this.state.amount
    return (
      <div className="f-view-container" id="view-purchase-cash-coupon">
        <form onSubmit={this.handleSubmit}>
        <ul className="list-unstyled order-list-wrap">
          <li><strong className="f16">{card.name}</strong></li>
          <li>单价
            <div className="pull-right">¥{card.price/1000}</div>
          </li>
          <li className="clearfix count-wrap">
            <div className="pull-left title">数量 <span className={+this.state.stock ? 'hide' : 'red'}>(库存不足)</span></div>
            <div className="f-number-input-wrap pull-right">
              <span className={+amount <= 1 ? 'minus disabled' : 'minus'} onClick={this.handleSubAmount}></span>
              <input ref="amount" type="number" value={amount} onChange={this.handleChangeAmount}/>
              <span className={+amount >= this.state.stock ? 'plus disabled' : 'plus'} onClick={this.handleAddAmount}></span>
            </div>   
          </li>
          <li>总计
            <div className="pull-right red">¥{card.price*amount/1000}</div>
          </li>
        </ul>
        <ul className="list-unstyled pay-type-list-wrap">
          <li className="selected">支付宝支付</li>
        </ul>
        <div className={this.state.isWechat ? 'wechat-tip-wrap': 'hide'}>微信内无法正常使用支付宝，您可以点击右上方的菜单按钮，然后选择“在浏览器中打开”</div>
        <div className="pay-btn-wrap">
          <button className={(this.state.amount && this.state.ajaxState) ? 'f-button' : 'f-button disabled'} type="submit">去付款</button>
        </div>
        </form>
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [Auth, Router.Navigation],
  getInitialState: function() {
    this.getMemberCard()
    return {
      data: null 
    };
  },
  getMemberCard: function() {
    Weile
      .get('getCard', {
        data: this.props.params.cardId
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
  render: function() {
    var _V = false
    if (this.state.data) { 
      _V = <View data={this.state.data}/> 
    }
    return (
      <div>
        <div id="second-header">
          <header className="member-card"> 
            <div className="pull-left goback-btn" onClick={this.handleGoback}>
              <i className="go-back-icon"></i> 
            </div>
            <span className="title f16">会员卡购买</span>
          </header>
        </div>
        {_V}
      </div>
    )
  }
})